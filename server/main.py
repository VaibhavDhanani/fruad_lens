from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import xgboost as xgb
import numpy as np
import os
import json

app = FastAPI()

# Load XGBoost models
model_dir = os.path.join(os.path.dirname(__file__), "AI-models")

models = {
    "mayank": {
        "name": "Mayank Model",
        "features": [
            "IP_Address_Flag", "Previous_Fraudulent_Activity", "Daily_Transaction_Count",
            "Failed_Transaction_Count_7d", "Account_Age", "Transaction_Distance", "Is_Weekend",
            "IsNight", "Time_Since_Last_Transaction", "Distance_Avg_Transaction_7d",
            "Transaction_To_Balance_Ratio"
        ],
        "feature_types": ["int", "int", "int", "int", "int", "float", "int", "int", "int", "float", "float"],
        "model_path": os.path.join(model_dir, "mayank.json"),
        "model": None
    },
    "yash_amount": {
        "name": "Yash with Amount Model",
        "features": [
            "Transaction_Amount", "IP_Address_Flag", "Previous_Fraudulent_Activity",
            "Daily_Transaction_Count", "Avg_Transaction_Amount_7d", "Failed_Transaction_Count_7d",
            "Transaction_Distance", "Avg_Transaction_Distance", "Monthly_Transaction_Count",
            "Transaction_Location_Flag", "Suspicious_IP_Flag", "Multiple_Account_Login"
        ],
        "feature_types": ["float", "int", "int", "int", "float", "int", "float", "float", "int", "int", "int", "int"],
        "model_path": os.path.join(model_dir, "yash_amount.json"),
        "model": None
    },
    "yash_ratio": {
        "name": "Yash with Ratio Model",
        "features": [
            "IP_Address_Flag", "Previous_Fraudulent_Activity", "Transaction_Amount_Ratio",
            "Failed_Transaction_Rate", "Transaction_Distance_Ratio", "Transaction_Count_Ratio",
            "Multiple_Account_Login", "Transaction_Location_Flag", "Suspicious_IP_Flag"
        ],
        "feature_types": ["int", "int", "float", "float", "float", "float", "int", "int", "int"],
        "model_path": os.path.join(model_dir, "yash_ratio.json"),
        "model": None
    }
}

# Mapping from form field to model field - all lowercase keys for consistent matching
form_to_model_field_map = {
    "ip_address_flag": "IP_Address_Flag",
    "previous_fraudulent_activity": "Previous_Fraudulent_Activity",
    "daily_transaction_count": "Daily_Transaction_Count",
    "failed_transaction_count_7d": "Failed_Transaction_Count_7d",
    "account_age": "Account_Age",
    "transaction_distance": "Transaction_Distance",
    "is_weekend": "Is_Weekend",
    "is_night": "IsNight",
    "time_since_last_transaction": "Time_Since_Last_Transaction",
    "distance_avg_transaction_7d": "Distance_Avg_Transaction_7d",
    "transaction_to_balance_ratio": "Transaction_To_Balance_Ratio",
    "transaction_amount": "Transaction_Amount",
    "avg_transaction_amount_7d": "Avg_Transaction_Amount_7d",
    "avg_transaction_distance": "Avg_Transaction_Distance",
    "monthly_transaction_count": "Monthly_Transaction_Count",
    "transaction_location_flag": "Transaction_Location_Flag",
    "suspicious_ip_flag": "Suspicious_IP_Flag",
    "multiple_account_login": "Multiple_Account_Login",
    "transaction_amount_ratio": "Transaction_Amount_Ratio",
    "failed_transaction_rate": "Failed_Transaction_Rate",
    "transaction_distance_ratio": "Transaction_Distance_Ratio",
    "transaction_count_ratio": "Transaction_Count_Ratio"
}

# Create a reverse mapping for looking up form fields by model field name
model_to_form_field_map = {v: k for k, v in form_to_model_field_map.items()}

# Load models at startup
@app.on_event("startup")
def load_models():
    for model in models.values():
        bst = xgb.Booster()
        bst.load_model(model["model_path"])
        model["model"] = bst
    print("Models loaded successfully")


# Input Schema
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


# Handle raw JSON for debugging
@app.post("/predict/{model_key}")
async def predict_endpoint(model_key: str, request: Request):
    # Get the raw request body
    raw_body = await request.body()
    body_str = raw_body.decode('utf-8')
    
    print(f"Raw request body: {body_str}")
    
    try:
        # Parse the raw JSON
        data = json.loads(body_str)
        
        # Validate data using Pydantic model
        input_data = InputData(**data)
        
        # Check if we have any non-default values in the input data
        input_dict = input_data.dict()
        non_default_fields = [k for k, v in input_dict.items() if v != 0 and v != 0.0]
        print(f"Non-default fields received: {non_default_fields}")
        
        # Call predict function
        return predict(model_key, input_data)
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Invalid input data: {str(e)}")


def predict(model_key: str, input_data: InputData):
    config = models.get(model_key)
    if not config or not config["model"]:
        raise HTTPException(status_code=500, detail="Model not available")

    # Print out received input data for debugging
    print(f"Processing prediction for model: {model_key}")
    print(f"Input data: {input_data.dict()}")
    
    features = []
    feature_names = []  # Store feature names in correct order
    
    for i, feature_name in enumerate(config["features"]):
        # Get the corresponding form field name
        form_field = model_to_form_field_map.get(feature_name)
        if not form_field:
            raise HTTPException(status_code=400, detail=f"Missing mapping for feature: {feature_name}")

        # Get the value from input_data
        value = getattr(input_data, form_field)
        feature_type = config["feature_types"][i]
        
        # Convert to appropriate type
        value = float(value) if feature_type == "float" else int(value)
        
        # Debug print
        print(f"Feature {feature_name} ({form_field}): {value}")
        
        features.append(value)
        feature_names.append(feature_name)

    # Debug: print all features before creating DMatrix
    print(f"All features for model {model_key}: {list(zip(feature_names, features))}")
    
    dmatrix = xgb.DMatrix(np.array([features]), feature_names=feature_names)
    prediction = config["model"].predict(dmatrix)[0]
    
    # Print prediction result for debugging
    print(f"Prediction for model {model_key}: {prediction}")
    
    return {
        "is_fraud": bool(prediction > 0.5),
        "probability": float(prediction),
        "model_name": config["name"],
        "features_used": len(features)
    }