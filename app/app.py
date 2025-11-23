from sqlalchemy import select
from fastapi import FastAPI, HTTPException,Form, Depends
from .schemas import wisata
from sqlalchemy.ext.asyncio import AsyncSession
from contextlib import asynccontextmanager
from app.core.database import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.destinations import Destination
from fastapi.middleware.cors import CORSMiddleware


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


    