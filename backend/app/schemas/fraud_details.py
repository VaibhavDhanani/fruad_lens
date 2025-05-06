# fraud_details_schema.py
from pydantic import BaseModel
from typing import Optional


class FraudDetailsBase(BaseModel):
    transaction_id: int
    fraud_label: bool
    fraud_type: str
    previous_fraudulent_activity: Optional[bool] = False


class FraudDetailsCreate(FraudDetailsBase):
    pass


class FraudDetailsUpdate(BaseModel):
    fraud_label: Optional[bool] = None
    fraud_type: Optional[str] = None
    previous_fraudulent_activity: Optional[bool] = None


class FraudDetailsOut(FraudDetailsBase):
    fraud_id: int

    class Config:
        orm_mode = True
