from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TransactionBase(BaseModel):
    user_id: int
    device_id: str
    transaction_amount: float
    transaction_hour: int
    is_weekend: bool
    beneficiary_account_number: str
    sender_lat: float
    sender_long: float
    beneficiary_lat: float
    beneficiary_long: float
    ip_address: str


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(BaseModel):
    transaction_amount: Optional[float] = None
    transaction_hour: Optional[int] = None
    is_weekend: Optional[bool] = None
    beneficiary_account_number: Optional[str] = None
    device_id: Optional[str] = None
    sender_lat: Optional[float] = None
    sender_long: Optional[float] = None
    beneficiary_lat: Optional[float] = None
    beneficiary_long: Optional[float] = None
    ip_address: Optional[str] = None


class TransactionOut(TransactionBase):
    transaction_id: int
    timestamp: datetime

    class Config:
        orm_mode = True
