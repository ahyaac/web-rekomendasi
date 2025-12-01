# app/models.py

from sqlalchemy import Column, Integer, String, DateTime, func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    password_hash = Column(String(255))
    created_at = Column(DateTime, server_default=func.now())
    
class UserPreferences(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False)
    environment = Column(String)
    tipe = Column(String)
    price_category = Column(String)

