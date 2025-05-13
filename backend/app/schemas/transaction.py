from pydantic import BaseModel
from typing import Dict, List, Any, Optional

class InputData(BaseModel):
    ip_address_flag: int = 0
    previous_fraudulent_activity: int = 0
    daily_transaction_count: int = 0
    failed_transaction_count_7d: int = 0
    account_age: int = 0
    transaction_distance: float = 0.0
    is_weekend: int = 0
    is_night: int = 0
    time_since_last_transaction: int = 0
    distance_avg_transaction_7d: float = 0.0
    transaction_to_balance_ratio: float = 0.0
    transaction_amount: float = 0.0
    avg_transaction_amount_7d: float = 0.0
    avg_transaction_distance: float = 0.0
    monthly_transaction_count: int = 0
    transaction_location_flag: int = 0
    suspicious_ip_flag: int = 0
    multiple_account_login: int = 0
    transaction_amount_ratio: float = 0.0
    failed_transaction_rate: float = 0.0
    transaction_distance_ratio: float = 0.0
    transaction_count_ratio: float = 0.0

class RetrainingParams(BaseModel):
    model_id: str
    balanced_ratio: float = 1.5
    version_suffix: Optional[str] = None