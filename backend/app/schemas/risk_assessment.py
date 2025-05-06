# risk_assessment_schema.py
from pydantic import BaseModel
from typing import Optional


class RiskAssessmentBase(BaseModel):
    transaction_id: int
    risk_score: float
    ip_address_flag: bool
    transaction_location_flag: bool
    suspicious_ip_flag: bool
    multiple_account_login: bool


class RiskAssessmentCreate(RiskAssessmentBase):
    pass


class RiskAssessmentUpdate(BaseModel):
    risk_score: Optional[float] = None
    ip_address_flag: Optional[bool] = None
    transaction_location_flag: Optional[bool] = None
    suspicious_ip_flag: Optional[bool] = None
    multiple_account_login: Optional[bool] = None


class RiskAssessmentOut(RiskAssessmentBase):
    assessment_id: int

    class Config:
        orm_mode = True
