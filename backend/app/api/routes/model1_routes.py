from fastapi import APIRouter
from pydantic import BaseModel
import pandas as pd
import numpy as np
import xgboost as xgb
import shap
import joblib  # <-- To load Isolation Forest model

router = APIRouter(prefix="/fastapi/model1", tags=["Model"])

# Load XGBoost model
booster = xgb.Booster()
booster.load_model("xgb_model.json")

# Load Isolation Forest model
iso_forest = joblib.load("isolation_forest_model.pkl")

# Feature columns for XGBoost
FEATURE_COLUMNS = [
    "IP_Address_Flag",
    "Previous_Fraudulent_Activity",
    "Daily_Transaction_Count",
    "Failed_Transaction_Count_7d",
    "Account_Age",
    "Transaction_Distance",
    "Is_Weekend",
    "IsNight",
    "Time_Since_Last_Transaction",
    "Distance_Avg_Transaction_7d",
    "Transaction_To_Balance_Ratio"
]



class TransactionInput(BaseModel):
    IP_Address_Flag: int
    Previous_Fraudulent_Activity: int
    Daily_Transaction_Count: int
    Failed_Transaction_Count_7d: int
    Account_Age: int
    Distance_From_Distance_Avg_7d: float
    Is_Weekend: int
    IsNight: int
    Time_Since_Last_Transaction: int
    Distance_Avg_Transaction_7d: float
    Transaction_To_Balance_Ratio: float

@router.post("/predict")
def predict_fraud(data: TransactionInput):
    input_dict = data.dict()
    input_dict["Transaction_Distance"] = input_dict["Distance_From_Distance_Avg_7d"]
    del input_dict["Distance_From_Distance_Avg_7d"]  # Remove old field

    # For XGBoost prediction
    xgb_df = pd.DataFrame([input_dict], columns=FEATURE_COLUMNS)
    dmatrix = xgb.DMatrix(xgb_df.values, feature_names=FEATURE_COLUMNS)
    prediction = booster.predict(dmatrix)[0]

    # SHAP explanation
    explainer = shap.TreeExplainer(booster)
    shap_values = explainer.shap_values(xgb_df)
    feature_importance = np.abs(shap_values).mean(axis=0)
    most_important_feature_index = np.argmax(feature_importance)
    most_important_feature = FEATURE_COLUMNS[most_important_feature_index]
    most_important_value = float(feature_importance[most_important_feature_index])

    # Random Forest (Isolation Forest) prediction
    iso_df = pd.DataFrame([input_dict])
    anomaly_result = iso_forest.predict(iso_df)[0]  # -1 = anomaly, 1 = normal
    is_anomaly = anomaly_result == -1

    # Final result
    return {
    "is_fraud": bool(prediction > 0.5),
    "fraud_probability": float(round(prediction, 4)),
    "most_affected_feature": most_important_feature,
    "feature_importance": float(most_important_value),
    "is_anomaly": bool(is_anomaly)  # Ensure this is native bool
    }
