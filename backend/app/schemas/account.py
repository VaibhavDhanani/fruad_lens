from pydantic import BaseModel
from typing import Optional


class AccountCreate(BaseModel):
    user_id: int
    account_balance: float
    card_type: str

    class Config:
        from_attributes = True


class AccountUpdate(BaseModel):
    account_balance: Optional[float]
    card_type: Optional[str]

    class Config:
        from_attributes = True


class AccountOut(BaseModel):
    account_id: int
    user_id: int
    account_balance: float
    card_type: Optional[str]

    class Config:
        from_attributes = True
