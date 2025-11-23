from sqlalchemy import Column, Integer, String, DateTime, func, Float
from app.core.database import Base

class Destination(Base):
    __tablename__ = "destinations"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    address = Column(String(255), nullable=False)
    description = Column(String, nullable=False)
    latitude = Column(Float(), nullable=False)
    longitude = Column(Float(), nullable=False)
    phone = Column(String(50), nullable=True)
    website = Column(String(255), nullable=True)
    operating_hours = Column(String(100), nullable=True)
    ticket_price = Column(Integer, nullable=True)
    total_rating = Column(Float(), nullable=True)
    total_review = Column(Integer, nullable=True)
    created_at = Column(DateTime, server_default=func.now())