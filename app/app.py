from sqlalchemy import select
from fastapi import FastAPI, HTTPException,Form, Depends
from .schemas import wisata
from sqlalchemy.ext.asyncio import AsyncSession
from contextlib import asynccontextmanager
from app.core.database import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.destinations import Destination
from fastapi.middleware.cors import CORSMiddleware
from app.services.get_embedding import get_embedding
from sqlalchemy import text


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


# API UNTUK WISATA
@app.get("/api/v1/wisata")
async def get_wisata(db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(Destination))
    return {"wisata": result.scalars().all()}


@app.get("/api/v1/wisata/{wisata_id}")
async def get_wisata_by_id(wisata_id: int, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(Destination).where(Destination.id == wisata_id))
    wisata = result.scalars().first()
    if not wisata:
        raise HTTPException(status_code=404, detail="Wisata not found")
    return {"wisata": wisata}

@app.get("/api/v1/wisata/{user_id}/recommendations")
async def get_recommendations(user_id: int, db: AsyncSession = Depends(get_async_session)):
    vector = get_embedding(["Murah, Sepi, Dekat"])[0]
    vector_str = "[" + ",".join(str(v) for v in vector) + "]"
    query_sql = text(f"""select d.id, d.title, d.address, d.description, d.latitude, d.longitude, d.phone, d.website, d.operating_hours, d.ticket_price, d.total_rating, d.total_review, emb.embedding <=> '{vector_str}'::vector
    AS cosine_distance from destination_content_embeddings emb join destinations d on emb.destination_id = d.id order by cosine_distance DESC""")
    
    result = await db.execute(query_sql)
    recommendations = result.mappings().all()
    if not recommendations:
        raise HTTPException(status_code=404, detail="No recommendations found")
    return {"user_id": user_id, "recommendations": recommendations}

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


    