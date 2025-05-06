from pydantic import BaseModel, EmailStr
from typing import Optional


class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None
    age: Optional[int] = None
    aadhar_card: str
    gender: str
    pan_card: str


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    username: Optional[str]
    email: Optional[EmailStr]
    full_name: Optional[str]
    age: Optional[int]
    aadhar_card: Optional[str]
    pan_card: Optional[str]
    gender: Optional[str]


class UserOut(UserBase):
    user_id: int

    class Config:
        from_attributes = True
        


class UserLogin(BaseModel):
    email: str
    password: str


class TokenData(BaseModel):
    access_token: str
    token_type: str = "bearer"
    
