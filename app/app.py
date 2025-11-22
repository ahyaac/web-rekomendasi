from fastapi import FastAPI, HTTPException,Form, Depends
from .schemas import wisata
from sqlalchemy.ext.asyncio import AsyncSession
from contextlib import asynccontextmanager
from app.core.database import get_async_session, Destination
from sqlalchemy.ext.asyncio import AsyncSession


app = FastAPI()


list_wisata =  {
    1: {"name": "Pantai Kuta", "location": "Bali", "description": "Pantai terkenal dengan pasir putihnya."},
    2: {"name": "Candi Borobudur", "location": "Magelang", "description": "Candi Buddha terbesar di dunia."},
    3: {"name": "Raja Ampat", "location": "Papua Barat", "description": "Destinasi menyelam dengan keanekaragaman hayati laut yang luar biasa."}
}

@app.get("/")
def test():
    return {"message": "Hello, World!"}


# API UNTUK WISATA
@app.get("/wisata")
def get_wisata():
    return {"wisata": list_wisata}


@app.get("/wisata/{wisata_id}")
def get_wisata_by_id(wisata_id: int):
    wisata = list_wisata.get(wisata_id)
    if not wisata:
        raise HTTPException(status_code=404, detail="Wisata not found")
    return {"wisata": wisata}

@app.post("/wisata")
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

    