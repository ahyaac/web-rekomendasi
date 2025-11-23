from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, relationship
from sqlalchemy import text
from app.core.config import settings
import asyncio
import selectors
from typing import AsyncGenerator



# =========================================================
# FIX untuk Windows: pakai SelectorEventLoop
# =========================================================
asyncio.set_event_loop(asyncio.SelectorEventLoop())


# =========================================================
# Base model untuk SQLAlchemy ORM
# =========================================================
class Base(DeclarativeBase):
    pass


# =========================================================
# Engine + Session maker
# =========================================================
DATABASE_URL = settings.DATABASE_URL

engine = create_async_engine(
    DATABASE_URL,
    echo=True,
)

async_session_maker = async_sessionmaker(
    engine,
    expire_on_commit=False
)


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session


# =========================================================
# Function test connection
# =========================================================
async def test_connection():
    try:
        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT 'helloworld'"))
            print("Database Connected OK!")
            print("Testing Result:", result.scalar())

    except Exception as err:
        print("Database tidak terhubung, cek server database Anda!")
        print("Error:", err)

def loop_factory():
    return asyncio.SelectorEventLoop()


# =========================================================
# Run test
# =========================================================
if __name__ == "__main__":
    asyncio.run(test_connection(), loop_factory=loop_factory)