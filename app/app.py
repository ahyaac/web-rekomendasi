from sqlalchemy import select
from fastapi import FastAPI, HTTPException,Form, Depends, Response, Cookie
from jose import jwt
from .schemas import wisata
from sqlalchemy.ext.asyncio import AsyncSession
from contextlib import asynccontextmanager
from app.core.database import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.destinations import Destination
from fastapi.middleware.cors import CORSMiddleware
from app.services.get_embedding import get_embedding
from sqlalchemy import text
from app.services.auth import hash_password, verify_password, create_access_token, decode_access_token
from app.services.deps import get_current_user_id
from app.schemas.wisata import UserCreate, UserOut
from app.models.user import User
from app.schemas.wisata import UserLogin, UserCreate, UserOut
from app.services.get_preferences import get_user_preferences_text
from app.services.auth import SECRET_KEY


app = FastAPI()

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # asal yang diijinkan
    allow_credentials=True,
    allow_methods=["*"],    # GET, POST, PUT, DELETE
    allow_headers=["*"],    # Header apa saja yang diijinkan
)

@app.get("/")
def test():
    return {"message": "Hello, World!"}

# User Session Login Register

@app.post("/register", response_model=UserOut)
async def register(data: UserCreate, db: AsyncSession = Depends(get_async_session)):
    # cek username
    q = await db.execute(select(User).where(User.name == data.username))
    existing = q.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="Username sudah ada")

    user = User(name=data.username, password_hash=hash_password(data.password))
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

@app.post("/api/v1/login")
async def login(data: UserLogin, response: Response, db: AsyncSession = Depends(get_async_session)):
    q = await db.execute(select(User).where(User.name == data.username))
    user = q.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=400, detail="User tidak ditemukan")

    # BANDINKAN PASSWORD PLAIN
    if data.password != user.password_hash:
        raise HTTPException(status_code=400, detail="Password salah")

    token = create_access_token({"user_id": user.id, "username": user.name})

    # set cookie (HTTP-only)
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="lax",     # atau "strict" / "none" sesuai kebutuhan
        secure=False,       # True jika pakai HTTPS (production)
        max_age=60 * 60,    # detik; sesuai expiry
        path="/"
    )

    return {"message": "Login sukses", "user": {"id": user.id, "username": user.name, "token": token}}

@app.get("/api/v1/me")
async def me(access_token: str = Cookie(None)):
    if not access_token:
        raise HTTPException(401, "Not logged in")

    try:
        data = jwt.decode(access_token, SECRET_KEY, algorithms=["HS256"])
        return {"loggedIn": True, "user": data}
    except Exception as e:
        print("Decode error:", e)
        raise HTTPException(401, "Invalid or expired token")

@app.post("/api/v1/logout")
async def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        path="/"
    )
    return {"message": "Logged out successfully"}
    
# API UNTUK WISATA
@app.get("/api/v1/wisata")
async def get_wisata(db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(Destination))
    return {"wisata": result.scalars().all()}

@app.get("/api/v1/wisata/recommendations")
async def get_recommendations(
    user_id: int | None = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_async_session)
):

    # =========================================
    # CASE 1 — USER TIDAK LOGIN
    # =========================================
    if user_id is None:
        default_pref = "Murah, Dekat, Ramai"

        vector = get_embedding([default_pref])[0]
        vector_str = "[" + ",".join(str(v) for v in vector) + "]"

        # Content-Based Filtering only (tanpa CF)
        query_sql = text(f"""
            SELECT
                d.id,
                d.title,
                d.address,
                d.description,
                d.latitude,
                d.longitude,
                d.phone,
                d.website,
                d.operating_hours,
                d.ticket_price,
                d.total_rating,
                d.total_review,
                emb.embedding <=> '{vector_str}'::vector AS cbf_distance
            FROM destinations d
            JOIN destination_content_embeddings emb ON emb.destination_id = d.id
            ORDER BY cbf_distance ASC
        """)

        result = await db.execute(query_sql)
        recommendations = result.mappings().all()

        return {
            "user_logged_in": False,
            "used_preferences": default_pref,
            "recommendations": recommendations
        }

    # =========================================
    # CASE 2 — USER LOGIN
    # =========================================
    preferences_text = await get_user_preferences_text(user_id, db)

    if not preferences_text:
        # fallback jika user belum set preference
        preferences_text = "Murah, Dekat, Sepi"

    vector = get_embedding([preferences_text])[0]
    vector_str = "[" + ",".join(str(v) for v in vector) + "]"

    query_sql = text(f"""
        WITH cbf AS (
            SELECT
                emb.destination_id,
                emb.embedding <=> '{vector_str}'::vector AS cbf_distance
            FROM destination_content_embeddings emb
        ),
        cf AS (
            SELECT
                f.destination_id,
                (f.factors <=> uf.factors) AS cf_distance
            FROM mf_user_factors uf
            JOIN mf_item_factors f ON TRUE
            WHERE uf.user_id = {user_id}
        )
        SELECT
            d.id,
            d.title,
            d.address,
            d.description,
            d.latitude,
            d.longitude,
            d.phone,
            d.website,
            d.operating_hours,
            d.ticket_price,
            d.total_rating,
            d.total_review,
            cf.cf_distance,
            cbf.cbf_distance,
            (0.5 * cf.cf_distance) + (0.5 * cbf.cbf_distance) AS final_score
        FROM destinations d
        JOIN cf ON cf.destination_id = d.id
        JOIN cbf ON cbf.destination_id = d.id
        ORDER BY final_score ASC
    """)

    result = await db.execute(query_sql)
    recommendations = result.mappings().all()

    return {
        "user_logged_in": True,
        "user_id": user_id,
        "used_preferences": preferences_text,
        "recommendations": recommendations
    }


@app.get("/api/v1/wisata/{wisata_id}")
async def get_wisata_by_id(wisata_id: int, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(Destination).where(Destination.id == wisata_id))
    wisata = result.scalars().first()
    if not wisata:
        raise HTTPException(status_code=404, detail="Wisata not found")
    return {"wisata": wisata}


@app.get("/api/v1/reviews/{destination_id}")
async def get_reviews(destination_id: int, db: AsyncSession = Depends(get_async_session)):
    query_sql = text(f"""SELECT u.name, d_rev.review_text, d_rev.rating, d_rev.destination_id
                        FROM destination_reviews d_rev
                        JOIN users u ON u.id = d_rev.user_id
                        WHERE d_rev.destination_id = {destination_id};
                        """)
    
    result = await db.execute(query_sql)
    reviews = result.mappings().all()
    if not reviews:
        raise HTTPException(status_code=404, detail="No reviews found")
    return {"destination_id": destination_id, "reviews": reviews}

@app.post("/api/v1/wisata")
async def create_wisata(wisata: wisata.wisataCreate, session: AsyncSession = Depends(get_async_session)):
    destination = Destination(
        title=wisata.title,
        address=wisata.address,
        description=wisata.description,
        latitude=wisata.latitude,
        longitude=wisata.longitude,
        phone=wisata.phone,
        website=wisata.website,
        operating_hours=wisata.operating_hours,
        ticket_price=wisata.ticket_price
    )
    session.add(destination)
    await session.commit()
    await session.refresh(destination)
    return {"message": "Wisata created successfully", "wisata": destination}


    