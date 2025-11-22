from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, relationship
from sqlalchemy import text
from app.core.config import settings
import asyncio
from typing import AsyncGenerator


DATABASE_URL = settings.DATABASE_URL

class Base(DeclarativeBase):
    pass


async def test_connection():
    try:
        engine = create_async_engine(DATABASE_URL, echo=True)
        
        async with engine.connect() as conn:
            result = await conn.execute(text("select 'helloworld'"))
            print("Database Connected!")
            print("Testing Resullt : ", result.scalar())
            
        await engine.dispose()
     
    except Exception as err:
        print("Database tidak terhubung, Cek laragon!!!")
        print(f'Error : {err}')
        
class Destination(Base):
    __tablename__ = "destinations"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    address = Column(String(255), nullable=False)
    description = Column(String(1000), nullable=True)
    latitude = Column(String(50), nullable=False)
    longitude = Column(String(50), nullable=False)
    phone = Column(String(50), nullable=True)
    website = Column(String(255), nullable=True)
    operating_hours = Column(String(100), nullable=True)
    ticket_price = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=text("CURRENT_TIMESTAMP"))
    
engine = create_async_engine(DATABASE_URL, echo=True)
async_session_maker = async_sessionmaker(engine, expire_on_commit=False)

async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session


if __name__ == "__main__":
    asyncio.run(test_connection())

