from fastapi import APIRouter
from pydantic import BaseModel
import xgboost as xgb

router = APIRouter(prefix="/model", tags=["Model"])

class TransactionData(BaseModel):
    IP_Address_Flag: float
    Previous_Fraudulent_Activity: float
    Transaction_Amount_Ratio: float
    Failed_Transaction_Ratio: float
    Distance_Ratio: float
    Transaction_Count_Ratio: float
    Transaction_Location_Flag: float
    Suspicious_IP_Flag: float
    Multiple_Account_Login: float

model = xgb.XGBClassifier()
model.load_model("xgb.json")

@router.post("/predict")
def predict(data: TransactionData):
    input_data = [[
        data.IP_Address_Flag,
        data.Previous_Fraudulent_Activity,
        data.Transaction_Amount_Ratio,
        data.Failed_Transaction_Ratio,
        data.Distance_Ratio,
        data.Transaction_Count_Ratio,
        data.Transaction_Location_Flag,
        data.Suspicious_IP_Flag,
        data.Multiple_Account_Login
    ]]
    prediction = model.predict(input_data)[0]
    probability = model.predict_proba(input_data)[0].tolist()

    return {
        "prediction": int(prediction),
        "probability": {
            "not_fraud": round(probability[0], 4),
            "fraud": round(probability[1], 4)
        }
    }
