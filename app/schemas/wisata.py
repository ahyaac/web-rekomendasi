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