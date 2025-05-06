from pydantic import BaseModel
from typing import Optional

class LocationCreate(BaseModel):
    location_name: str
    latitude: float
    longitude: float

    class Config:
        orm_mode = True

class LocationUpdate(BaseModel):
    location_name: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]

    class Config:
        orm_mode = True

class LocationOut(BaseModel):
    location_id: int
    location_name: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]

    class Config:
        orm_mode = True
