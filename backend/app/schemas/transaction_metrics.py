# transaction_metrics_schema.py
from pydantic import BaseModel
from typing import Optional


class TransactionMetricsBase(BaseModel):
    user_id: int
    daily_transaction_count: int
    weekly_transaction_count: int
    monthly_transaction_count: int
    avg_transaction_amount_7d: float
    failed_transaction_count_7d: int
    avg_transaction_distance: float
    time_since_last_transaction: float
    transaction_distance: float


class TransactionMetricsCreate(TransactionMetricsBase):
    pass


class TransactionMetricsUpdate(BaseModel):
    daily_transaction_count: Optional[int] = None
    weekly_transaction_count: Optional[int] = None
    monthly_transaction_count: Optional[int] = None
    avg_transaction_amount_7d: Optional[float] = None
    failed_transaction_count_7d: Optional[int] = None
    avg_transaction_distance: Optional[float] = None
    time_since_last_transaction: Optional[float] = None
    transaction_distance: Optional[float] = None


class TransactionMetricsOut(TransactionMetricsBase):
    metric_id: int

    class Config:
        orm_mode = True
