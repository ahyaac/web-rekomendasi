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
# from app.services.get_embedding import get_embedding
from sqlalchemy import text
from app.services.auth import hash_password, verify_password, create_access_token, decode_access_token
from app.services.deps import get_current_user_id
from app.schemas.wisata import UserCreate, UserOut
from app.models.user import User
from app.schemas.wisata import UserLogin, UserCreate, UserOut
from app.services.get_preferences import get_user_preferences_text
from app.services.auth import SECRET_KEY
from app.models.user import UserPreferences
from app.schemas.wisata import UserPreferencesInput


app = FastAPI()

origins = ["http://localhost:5173",
           "http://127.0.0.1:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # asal yang diijinkan
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],    # GET, POST, PUT, DELETE
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
        default_pref = "[0.21773767,0.970391,-0.10091748,0.2045959,0.5874544,-0.95621186,-0.54891497,-0.39923084,0.6358775,-0.06322522,-0.8601883,-0.15001945,-0.40126762,-0.27753302,-0.2546262,-1.1567992,0.08006506,0.049256466,0.3999923,-0.24151185,0.41668367,0.1540836,-0.1639711,-0.6321742,0.10707633,-0.58165455,1.056206,0.29280353,-0.8830797,-0.16495907,0.6093964,1.1359743,0.68376195,0.53689945,-1.253814,1.6333847,-0.094973065,-0.3272141,0.223807,-0.529613,-0.6259625,0.06894572,0.81251204,-0.11488967,0.06259253,0.23031667,0.2519802,1.6244503,-0.64416534,1.021555,-1.7613388,-1.2398316,-0.31671447,-0.020975072,0.58743036,0.332782,0.34982184,-1.7073257,-0.5825346,1.1696382,-0.9602396,-0.3084436,-1.4229147,-0.6406295,0.51060116,0.863966,1.4433882,-0.61169153,-0.5506321,-0.98703825,-0.34230068,0.0017701149,0.5565022,0.19867526,1.2520452,-2.0137105,-0.22721112,1.5085903,0.39343947,1.084018,-0.51887864,-0.20774528,-0.1557037,0.8100726,0.7762394,-0.7926343,-0.9405699,-0.82564276,0.47040758,-0.3953094,-0.6155691,0.083113,0.36267295,-0.07126753,-0.76689214,0.8238753,0.9935905,-0.7786981,-0.80794907,-0.46347317,-0.7891751,0.35441417,-0.65840876,-0.7406353,0.23401746,0.24410672,0.76549375,-0.3821546,1.5276154,-0.7401851,-0.21042618,-0.20271163,0.39023748,-1.3306324,1.0594254,0.0064489366,-0.028087374,-0.04761099,1.0978773,-0.113186575,-0.41518864,0.72040313,-1.540197,0.016233575,0.58430266,0.3070326,-0.14640807,1.1745058,0.88732225,1.2103274,-0.39466667,-0.32095948,0.26449633,-0.03361381,-0.117837116,1.1110309,0.21882863,0.834805,-0.3602329,0.7583681,0.24120578,0.9856758,-0.2089973,-0.13639621,0.5696062,-0.035333432,0.003583094,-0.021983195,0.52478915,-0.27902046,-1.0624034,0.7353002,0.28887418,0.58561236,0.5295456,2.5598466,-0.5274668,-1.5927029,-2.0420127,1.0423099,-0.7679664,0.19989984,0.31764403,0.22494845,-0.8176961,-0.49424782,-0.0667279,-0.91820776,0.8845398,-0.14024428,-0.5860283,-0.5767162,-0.56934446,0.0397753,0.2598397,0.25222334,0.98782647,-0.079774186,0.16922577,0.5675808,0.6481,1.599788,0.34492475,0.486183,0.6007452,-0.6424686,1.1551212,-0.17229775,-0.9263533,-0.4612419,0.42460084,0.026108945,0.47741264,0.29180485,0.51165307,1.2806284,-0.5935794,-0.34677508,0.5273236,1.3859224,-0.63248235,-0.92477,-0.33663753,-1.8058914,0.9855474,-1.7298113,0.44855553,0.26131412,-1.3873109,-0.29091242,1.1291865,-0.11144868,-0.3273624,-1.7251533,-0.20194378,0.302872,-0.11831814,-0.77881044,-0.42742577,0.26590955,0.42208606,-0.3342432,-0.5125719,2.5646305,-0.2093248,-0.9689268,-0.22781906,-0.23540339,-1.3712763,0.1208636,0.5183949,0.10421886,-0.34607795,0.041184403,1.9583174,0.2815372,0.7752086,-0.08618498,-0.13242368,-0.30825084,-1.9843009,-0.41571873,-0.16389309,0.8313807,1.6916478,0.07097737,-0.1917576,1.1011593,-1.4807312,-0.6789732,-0.07736118,0.12005882,-0.5934562,-0.7812811,-0.69765544,-1.843399,0.4477903,-0.3278691,1.1110847,1.0456719,-0.879391,-0.3134036,1.1854261,-0.6157821,0.55179393,2.0503638,0.1600702,1.0704348,0.46749753,-0.633364,0.65781176,-0.31809977,0.18855047,-0.1678377,-0.5391054,0.41645345,1.8214743,0.472256,-0.43293276,-0.10665838,0.0014671057,-0.3153579,-0.45557895,0.57143956,0.0037416935,-0.0065365434,-0.23532173,1.7847006,-0.84521914,-1.166659,-0.8136223,-0.9142582,-2.0290046,-0.3732901,1.0884168,-0.80527484,0.5294827,-0.8612691,0.54549134,-0.55980283,0.58575404,0.6697675,1.6085949,0.26251632,1.7331413,-1.7528963,-0.46833426,-0.00770455,-0.41787982,-1.6310651,1.3490509,-0.8468832,1.1284523,-0.97533816,-0.024158752,1.0666716,0.20425573,-0.44119158,-0.1246763,-0.91624725,-1.0819596,2.1646628,0.9948095,1.0027173,0.33494955,1.58146,0.60478365,1.5146947,0.12653725,0.5489561,-1.408067,-1.638212,0.7685541,-1.191376,0.35260338,-0.4750445,-0.13831797,-0.7259726,-0.17900848,0.16343206,-0.47104082,0.17523822,0.90640295,0.5993114,0.98362017,-0.69596493,-1.3226722,-0.40439692,1.3253807,-0.66197985,0.5246569,-0.111803964,-0.23081513,0.2870291,-1.127621,-0.22856387,0.7433551,0.23409256,0.6139674,-0.2230986,2.9033406,0.046985887,-0.31438714,-1.2731378,0.75415456,-0.90891427,-1.3762438,-0.75204897,-0.5187256,-0.030357838,0.6884395,0.025423015,0.83646333,-1.1298885,-0.07841656,-0.16772394,0.54158604,-1.3699955,-2.5749278,0.15463158,0.23407039,-0.7097483,0.5220082,0.5134598,-0.30650905,-0.17502192,0.99978256,-0.015669541,-1.1365016,0.6454787,-0.39922053,0.1811693,-0.24727373,1.0168636,0.15531757,0.97661656,0.16077185,0.47698322,-1.0193353,0.45102787,0.5755286,0.26734862,0.084824085,0.4743722,0.7257222,0.6094678,1.5969547,0.5418147,-1.1590441,-2.2995698,-0.56271017,-1.7446029,-1.3659742,-0.31806004,0.24501571,0.8625706,-0.40797883,0.42329568,0.44099236,-1.2546651,-0.5902852,0.13912794,-0.6313615,0.05830148,0.3520766,1.5390952,-0.6051306,0.69148076,1.377262,1.0166308,-1.5801982,1.1849812,0.43189692,0.26464304,-1.1335628,-0.27493095,1.254488,0.21112466,-1.3460706,-1.7142073,1.0873454,-1.0419825,-0.23186788,-0.12552111,-0.37277636,-0.6253664,0.6279329,0.21283469,0.6984363,0.5610457,0.17466398,-0.041475125,-1.583622,0.93996894,0.049406447,0.7665025,1.2352715,-0.117742896,-0.13701108,1.2441827,-1.199034,0.53287977,0.50277746,-0.46209875,0.36330605,-0.8449789,-0.8492726,0.7931949,0.66388804,0.9648436,-0.49993324,0.093849614,0.6063498,-0.55811393,0.69953316,0.5333797,0.32615066,0.21536216,0.42300385,-1.482241,-0.43652186,0.03418707,1.0437689,0.6383203,-0.06408119,-0.50182587,0.3109427,-0.6977502,-0.3869972,0.26646742,0.01052053,0.16513045,-1.9611031,0.48325282,-0.6218583,0.5417755,-0.3629946,0.30333656,0.18817072,-1.3925058,-0.7348633,-1.4783983,0.4599115,-0.7543385,-0.6594802,1.1654735,1.1073443,1.2336085,0.85718185,-0.28983665,-0.4738616,-1.1609297,0.63753283,0.6693889,-0.021667471,-0.4356737,-0.024525637,-0.8035534,0.7959031,0.5001889,-1.6001952,0.11349412,-0.65237564,-0.5599651,-0.5168628,0.359654,0.72256875,-2.001944,-0.28751296,-0.0481987,0.5002131,0.0151755335,0.7054302,-0.9313632,-0.5531882,0.7426578,1.0242174,-0.3067145,-0.21798317,-0.16609046,-1.2548311,-0.70153314,0.6788608,-1.3321235,-0.6195471,-0.4530018,-0.22495365,-0.9210659,-1.7721027,-1.1088406,1.5634234,-0.44647378,-0.13605843,-0.32516092,0.30642992,-1.6199566,-0.5208267,0.2666114,-0.97180814,0.61013585,0.19020024,-0.1581767,0.3084343,1.0752555,-0.7300645,-1.4442818,-0.32893795,0.94717234,0.4457418,0.124159575,0.9088073,-0.32886544,0.09627116,0.6420609,0.51419663,-0.630381,-0.51551276,0.042227425,0.14310165,0.23067296,-0.16368082,0.031180847,0.047583465,-0.64474165,2.1980262,-0.6951122,0.18485956,0.12178086,-0.2819238,-0.5383687,-0.22109647,-0.04221812,-0.82351285,0.62704706,0.90105075,-0.2109931,0.7944185,-0.168874,1.0712615,0.10606675,1.8431616,-0.5116709,-0.5898717,0.084434725,0.91174763,-2.1810546,-1.2710421,0.6479634,-0.28433508,-0.18795832,-0.6143337,-0.37978724,-0.7643038,1.3041782,0.7091916,-0.010257959,0.22257626,0.89064443,-1.35226,-0.7254614,-0.5747194,0.39534658,-0.09407546,0.6992091,0.56277263,0.967865,0.5278738,-0.73013383,0.016701806,-0.7033344,0.53606045,-0.31477886,0.56451225,-1.1847888,-0.61647016,0.80009824,-1.164409,0.30643052,0.35944945,0.13351107,0.31824857,-0.3030749,1.6376117,1.949156,0.91560876,0.16936716,0.92608565,0.6810573,0.7676453,0.36150557,-1.7464793,-0.2250247,-0.12756442,1.0099938,0.14203396,-0.2976019,-0.3558554,-0.45301858,-0.66835606,-0.39703208,-0.12291028,-1.2651268,0.76759344,-0.5979226,1.0731277,0.0013845444,-0.21045382,0.337362,0.99733573,-1.0113933,0.86739814,0.5021903,1.4700787,-1.0108656,0.17989856,-0.54949963,-0.6921598,-0.87469035,-0.098861516,-0.32377735,0.54229635,0.37255487,0.58112466,-0.6976365,0.31817338,-1.511564,-0.5913966,0.397467,0.7818686,-0.9599066,-0.28453755,0.76910865,-0.49064603,1.1736491,0.25668588,-0.4434019,-0.53722394,-0.19586639,-1.8220577,-0.30909654,0.28011742,-0.01016994,0.2834936,-0.96442974,-0.011356831,-1.7965494,0.38306493,0.3604206,-0.38579333,-1.0936539,0.39453617,0.476578,-0.57159317,0.37932983,0.022045946,-0.077394344,-0.3734858,-1.300252,-0.73341167,-0.06440167,0.34944725,-0.40076667,0.15441635,0.77879953,0.49189416,-1.3583751,2.5182586,0.507609,-0.15645638,-0.09416436,0.8072397,-0.7506279,-0.5808471,1.4787943,0.40141812,0.53665364,-0.36453635,0.627799,-1.301668,0.29609543,0.269209,2.227099,-0.58222264,2.210999,0.36442286,-1.0568507,-0.40014067,-1.062942,-0.37645555,0.7652252,-0.84334916,-1.4896244,1.164308,-0.10962836,-0.52718437,-0.4187358,-0.2757079,-0.88498104,-0.036728255,0.7545537,-0.34938368,0.80797464,0.50970423,1.6212053,1.0469922,1.8574156,0.41032547,0.40160355]"

        # vector = get_embedding([default_pref])[0]
        # vector_str = "[" + ",".join(str(v) for v in vector) + "]"

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
                emb.embedding <=> '{default_pref}'::vector AS cbf_distance
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

    vector_str = preferences_text

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
    # if not reviews:
    #     raise HTTPException(status_code=404, detail="No reviews found")
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


@app.get('/api/v1/preferences')
async def get_user_preferences(user_id: int | None = Depends(get_current_user_id), db: AsyncSession = Depends(get_async_session)):
    q = await db.execute(
        select(
            UserPreferences.environment,
            UserPreferences.tipe,
            UserPreferences.price_category
        ).where(UserPreferences.user_id == user_id)
    )

    result = q.mappings().first()

    if not result:
        return None

    return {"Message ": "Success", "preferences": result}

@app.post('/api/v1/preferences')
async def update_user_preferences(
    prefs: UserPreferencesInput,
    user_id: int | None = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_async_session)
):
    if user_id is None:
        raise HTTPException(status_code=401, detail="Unauthorized")

    # 1. Cek apakah user sudah memiliki preferensi di database
    query = await db.execute(
        select(UserPreferences).where(UserPreferences.user_id == user_id)
    )
    existing_pref = query.scalars().first()

    if existing_pref:
        # 2. Jika sudah ada, LAKUKAN UPDATE
        # Kita update field yang berubah saja
        existing_pref.environment = prefs.environment
        existing_pref.tipe = prefs.tipe
        existing_pref.price_category = prefs.price_category
        
        # Tidak perlu db.add() karena objek sudah dilacak oleh session
        # Cukup commit perubahan
        await db.commit()
        await db.refresh(existing_pref)
        
        return {"message": "Preferences updated successfully", "data": existing_pref}
    
    else:
        # 3. Jika belum ada, BUAT BARU (INSERT)
        new_pref = UserPreferences(
            user_id=user_id,
            environment=prefs.environment,
            tipe=prefs.tipe,
            price_category=prefs.price_category
        )
        
        db.add(new_pref)
        await db.commit()
        await db.refresh(new_pref)
        
        return {"message": "Preferences created successfully", "data": new_pref}