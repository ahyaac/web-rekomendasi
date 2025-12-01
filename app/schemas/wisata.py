from pydantic import BaseModel


class wisataCreate(BaseModel):
    id: int
    title: str
    address: str
    description:str
    latitude: float
    longitude: float
    phone: str
    website: str
    operating_hours: str
    ticket_price: int
    total_rating: float
    total_review: int
    
class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str

    class Config:
        orm_mode = True
