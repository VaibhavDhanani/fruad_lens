from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TransactionBase(BaseModel):
    user_id: int
    account_id: int
    device_id: str
    transaction_amount: float
    transaction_hour: int
    is_weekend: bool
    beneficiary_account_number: str
    origin_location_id: int
    beneficiary_location_id: int
    device_id: Optional[str]


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(BaseModel):
    transaction_amount: Optional[float]
    transaction_hour: Optional[int]
    is_weekend: Optional[bool]
    beneficiary_account_number: Optional[str]
    device_id: Optional[str]
    origin_location_id: Optional[int]
    beneficiary_location_id: Optional[int]


class TransactionOut(TransactionBase):
    transaction_id: int
    timestamp: datetime

    class Config:
        orm_mode = True
