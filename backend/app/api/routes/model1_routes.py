from fastapi import APIRouter
from pydantic import BaseModel
import pandas as pd
import numpy as np
import xgboost as xgb
import shap

print(shap.__version__)

router = APIRouter(prefix="/model1", tags=["Model"])

# Load XGBoost Booster from JSON
booster = xgb.Booster()
booster.load_model("xgb_model.json")

# Feature column names used during training
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
    Transaction_Distance: float
    Is_Weekend: int
    IsNight: int
    Time_Since_Last_Transaction: int
    Distance_Avg_Transaction_7d: float
    Transaction_To_Balance_Ratio: float

@router.post("/predict")
def predict_fraud(data: TransactionInput):
    # Convert input to DataFrame to preserve feature names
    df = pd.DataFrame([data.dict()], columns=FEATURE_COLUMNS)
    dmatrix = xgb.DMatrix(df, feature_names=FEATURE_COLUMNS)

    # Get model prediction
    prediction = booster.predict(dmatrix)[0]

    # Initialize SHAP explainer
    explainer = shap.TreeExplainer(booster)
    
    # Get SHAP values for the given input
    shap_values = explainer.shap_values(df)

    # Calculate feature importance based on SHAP values (mean absolute value)
    feature_importance = np.abs(shap_values).mean(axis=0)
    
    # Find the index of the most important feature (highest absolute SHAP value)
    most_important_feature_index = np.argmax(feature_importance)

    # Get the name of the most important feature
    most_important_feature = FEATURE_COLUMNS[most_important_feature_index]
    most_important_value = float(feature_importance[most_important_feature_index])

    # Convert numpy prediction to native Python types
    is_fraud = bool(prediction > 0.5)
    fraud_probability = round(float(prediction), 4)

    # Return prediction along with the most affected feature and its importance
    return {
        "is_fraud": is_fraud,
        "fraud_probability": fraud_probability,
        "most_affected_feature": most_important_feature,
        "feature_importance": most_important_value
    }
