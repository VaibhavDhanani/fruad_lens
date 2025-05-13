from fastapi import HTTPException, Body, Request
import xgboost as xgb
import numpy as np
import pandas as pd
import os
import json
from typing import List
from datetime import datetime
import requests
from pydantic import BaseModel
from typing import Optional

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

model_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "AI-models")

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

model_to_form_field_map = {v: k for k, v in form_to_model_field_map.items()}

def load_models():
    for model in models.values():
        try:
            bst = xgb.Booster()
            bst.load_model(model["model_path"])
            model["model"] = bst
        except Exception as e:
            print(f"Error loading model {model['name']}: {str(e)}")
    print("Models loaded successfully")

def prepare_features_for_model(data: List[dict], model_key: str) -> pd.DataFrame:
    """
    Prepare features for a specific model from raw transaction data
    """
    features = models[model_key]["features"]
    df = pd.DataFrame(data)
    
    feature_mapping = {
        "ip_address_flag": lambda x: x.fillna(0).astype(int),
        "previous_fraudulent_activity": lambda x: x.fillna(0).astype(int),
        "daily_transaction_count": lambda x: x.fillna(0).astype(int),
        "failed_transaction_count_7d": lambda x: x.fillna(0).astype(int),
        "account_age": lambda x: x.fillna(0).astype(int),
        "transaction_distance": lambda x: x.fillna(0).astype(float),
        "is_weekend": lambda x: x.apply(lambda v: 1 if v else 0).astype(int),
        "is_night": lambda x: x.apply(lambda v: 1 if v else 0).astype(int),
        "time_since_last_transaction": lambda x: x.fillna(0).astype(int),
        "distance_avg_transaction_7d": lambda x: x.fillna(0).astype(float),
        "transaction_to_balance_ratio": lambda x: x.fillna(0).astype(float),
        "transaction_amount": lambda x: x.fillna(0).astype(float),
        "avg_transaction_amount_7d": lambda x: x.fillna(0).astype(float),
        "avg_transaction_distance": lambda x: df["distance_avg_transaction_7d"].fillna(0).astype(float),  # Use available column
        "monthly_transaction_count": lambda x: (df["daily_transaction_count"] * 30).fillna(0).astype(int),  # Estimate
        "transaction_location_flag": lambda x: ((df["sender_lat"].notnull() & df["beneficiary_lat"].notnull())).astype(int),
        "suspicious_ip_flag": lambda x: df["ip_address_flag"].fillna(0).astype(int),  # Use same as IP flag
        "multiple_account_login": lambda x: (df["ip_address_flag"] & (df["daily_transaction_count"] > 3)).astype(int),  # Estimate
        "transaction_amount_ratio": lambda x: (df["transaction_amount"] / df["avg_transaction_amount_7d"].replace(0, 1)).fillna(1).astype(float),
        "failed_transaction_rate": lambda x: (df["failed_transaction_count_7d"] / df["daily_transaction_count"].replace(0, 1)).fillna(0).astype(float),
        "transaction_distance_ratio": lambda x: (df["transaction_distance"] / df["distance_avg_transaction_7d"].replace(0, 1)).fillna(1).astype(float),
        "transaction_count_ratio": lambda x: (df["daily_transaction_count"] / 10).fillna(0.1).clip(0, 1).astype(float)  # Normalized to [0,1]
    }
    
    result_df = pd.DataFrame()
    
    for feature in features:
        field_name = model_to_form_field_map.get(feature, None)
        if field_name and field_name in df.columns:
            if field_name in feature_mapping:
                result_df[feature] = feature_mapping[field_name](df[field_name])
            else:
                result_df[feature] = df[field_name].fillna(0)
        elif feature == "IsNight" and "is_night" in df.columns:
            result_df[feature] = df["is_night"].apply(lambda x: 1 if x else 0).fillna(0).astype(int)
        elif feature == "Is_Weekend" and "is_weekend" in df.columns:
            result_df[feature] = df["is_weekend"].apply(lambda x: 1 if x else 0).fillna(0).astype(int)
        elif feature == "IP_Address_Flag" and "ip_address_flag" in df.columns:
            result_df[feature] = df["ip_address_flag"].apply(lambda x: 1 if x else 0).fillna(0).astype(int)
        else:
            print(f"Warning: Feature {feature} not found in data, using zeros")
            result_df[feature] = 0
            
    for i, feature in enumerate(features):
        dtype = models[model_key]["feature_types"][i]
        if dtype == "int":
            result_df[feature] = result_df[feature].fillna(0).astype(int)
        elif dtype == "float":
            result_df[feature] = result_df[feature].fillna(0.0).astype(float)
    
    return result_df

def get_balanced_dataset(transactions: List[dict], balanced_ratio: float = 1.5) -> List[dict]:
    """
    Create a balanced dataset with all fraud transactions and a subset of non-fraud transactions
    based on the specified ratio
    """
    df = pd.DataFrame(transactions)
    
    if 'is_fraud' not in df:
        if 'status' in df:
            df['is_fraud'] = df['status'] == 'FRAUD'
        else:
            raise ValueError("Cannot determine fraud status from data")
    
    df['is_fraud'] = df['is_fraud'].fillna(False)
    df['is_fraud'] = df['is_fraud'].apply(lambda x: bool(x) if not pd.isna(x) else False)
    
    fraud_transactions = df[df['is_fraud'] == True]
    non_fraud_transactions = df[df['is_fraud'] == False]
    
    num_fraud = len(fraud_transactions)
    num_non_fraud_to_keep = min(int(num_fraud * balanced_ratio), len(non_fraud_transactions))
    
    print(f"Found {num_fraud} fraud transactions and {len(non_fraud_transactions)} non-fraud transactions")
    print(f"Keeping {num_non_fraud_to_keep} non-fraud transactions for balanced training")
    
    if num_non_fraud_to_keep < len(non_fraud_transactions):
        non_fraud_sample = non_fraud_transactions.sample(n=num_non_fraud_to_keep, random_state=42)
    else:
        non_fraud_sample = non_fraud_transactions
    
    # Combine and shuffle
    balanced_df = pd.concat([fraud_transactions, non_fraud_sample]).sample(frac=1, random_state=42)
    
    return balanced_df.to_dict('records')

def log_model_update(model_id, version, num_transactions, num_fraud):
    """Log model update details for tracking purposes"""
    log_entry = {
        "timestamp": datetime.now().isoformat(),
        "model_id": model_id,
        "version": version,
        "num_transactions": num_transactions,
        "num_fraud": num_fraud
    }
    
    log_path = os.path.join(model_dir, "model_updates.log")
    with open(log_path, "a") as f:
        f.write(json.dumps(log_entry) + "\n")

def predict(model_key: str, input_data: InputData):
    config = models.get(model_key)
    if not config or not config["model"]:
        raise HTTPException(status_code=500, detail="Model not available")

    print(f"Processing prediction for model: {model_key}")
    print(f"Input data: {input_data.dict()}")
    
    features = []
    feature_names = []  
    
    for i, feature_name in enumerate(config["features"]):
        form_field = model_to_form_field_map.get(feature_name)
        if not form_field:
            raise HTTPException(status_code=400, detail=f"Missing mapping for feature: {feature_name}")

        value = getattr(input_data, form_field)
        feature_type = config["feature_types"][i]
        value = float(value) if feature_type == "float" else int(value)
        print(f"Feature {feature_name} ({form_field}): {value}")
        features.append(value)
        feature_names.append(feature_name)

    print(f"All features for model {model_key}: {list(zip(feature_names, features))}")
    
    dmatrix = xgb.DMatrix(np.array([features]), feature_names=feature_names)
    prediction = config["model"].predict(dmatrix)[0]
    
    print(f"Prediction for model {model_key}: {prediction}")
    
    return {
        "is_fraud": bool(prediction > 0.5),
        "probability": float(prediction),
        "model_name": config["name"],
        "features_used": len(features)
    }

# ML model endpoints
async def retrain_model(params: RetrainingParams):
    try:
        model_id = params.model_id
        balanced_ratio = params.balanced_ratio
        version_suffix = params.version_suffix
        
        if model_id not in models:
            raise HTTPException(status_code=400, detail=f"Invalid model ID: {model_id}")
        current_model = models[model_id]["model"]        
        try:
            response = requests.get('http://13.127.98.0/api/transactions/')
            if not response.ok:
                raise Exception(f"Failed to fetch transactions: {response.status_code}")
            
            transactions = response.json()
            if not transactions or not isinstance(transactions, list) or len(transactions) == 0:
                raise Exception("No transactions found or invalid data format")
                
            print(f"Fetched {len(transactions)} transactions")
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching transactions: {str(e)}")
        
        balanced_transactions = get_balanced_dataset(transactions, balanced_ratio)
        
        features_df = prepare_features_for_model(balanced_transactions, model_id)
        
        y = pd.DataFrame(balanced_transactions)['is_fraud'].apply(lambda x: 1 if x else 0).values
        
        dtrain = xgb.DMatrix(features_df, label=y)        
        params = {
            'objective': 'binary:logistic',
            'eval_metric': 'logloss',
            'max_depth': 6,
            'eta': 0.1,  
            'min_child_weight': 1,
            'subsample': 0.8,
            'colsample_bytree': 0.8,
            'scale_pos_weight': sum(y == 0) / sum(y == 1)  
        }
        num_round = 50
        updated_model = xgb.train(
            params, 
            dtrain, 
            num_round,
            xgb_model=current_model
        )
        
        
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        if version_suffix:
            version = f"{version_suffix}_{timestamp}"
        else:
            version = f"v{timestamp}"
        
        new_model_path = os.path.join(model_dir, f"{model_id}_{version}.json")
        updated_model.save_model(new_model_path)
        models[model_id]["model"] = updated_model
        preds = updated_model.predict(dtrain)
        predictions = [1 if p > 0.5 else 0 for p in preds]
        accuracy = sum(predictions[i] == y[i] for i in range(len(y))) / len(y)
        
        tp = sum(1 for i in range(len(y)) if predictions[i] == 1 and y[i] == 1)
        tn = sum(1 for i in range(len(y)) if predictions[i] == 0 and y[i] == 0)
        fp = sum(1 for i in range(len(y)) if predictions[i] == 1 and y[i] == 0)
        fn = sum(1 for i in range(len(y)) if predictions[i] == 0 and y[i] == 1)
        
        precision = tp / (tp + fp) if tp + fp > 0 else 0
        recall = tp / (tp + fn) if tp + fn > 0 else 0
        f1_score = 2 * precision * recall / (precision + recall) if precision + recall > 0 else 0
        
        log_model_update(model_id, version, len(balanced_transactions), int(sum(y)))
        
        return {
            "success": True,
            "model_id": model_id,
            "version": version,
            "saved_path": new_model_path,
            "num_transactions_used": len(balanced_transactions),
            "num_fraud": int(sum(y)),
            "num_non_fraud": int(len(y) - sum(y)),
            "metrics": {
                "accuracy": accuracy,
                "precision": precision,
                "recall": recall,
                "f1_score": f1_score
            }
        }
        
    except Exception as e:
        print(f"Error retraining model: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retraining model: {str(e)}")

async def get_available_models():
    try:
        available_models = []
        for model_id, model_info in models.items():
            versioned_models = []
            for filename in os.listdir(model_dir):
                if filename.startswith(model_id + "_") and filename.endswith(".json"):
                    version = filename[len(model_id)+1:-5]  # Extract the version
                    versioned_models.append({
                        "version": version,
                        "path": os.path.join(model_dir, filename)
                    })
            
            available_models.append({
                "id": model_id,
                "name": model_info["name"],
                "features": model_info["features"],
                "base_model_loaded": model_info["model"] is not None,
                "versions": versioned_models
            })
            
        return {"models": available_models}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Activate a specific model version
async def activate_model(model_data: dict = Body(...)):
    try:
        model_id = model_data.get("model_id")
        version = model_data.get("version")
        
        if model_id not in models:
            raise HTTPException(status_code=400, detail=f"Invalid model ID: {model_id}")
        
        model_path = os.path.join(model_dir, f"{model_id}_{version}.json")
        if not os.path.exists(model_path):
            raise HTTPException(status_code=404, detail=f"Model version not found: {model_id}_{version}")
        
        # Load the model
        bst = xgb.Booster()
        bst.load_model(model_path)
        models[model_id]["model"] = bst
        
        return {
            "success": True,
            "model_id": model_id,
            "version": version,
            "message": f"Model {model_id} version {version} activated successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def predict_endpoint(model_key: str, request: Request):
    raw_body = await request.body()
    body_str = raw_body.decode('utf-8')
    
    print(f"Raw request body: {body_str}")
    
    try:
        data = json.loads(body_str)
        input_data = InputData(**data)
        input_dict = input_data.dict()
        non_default_fields = [k for k, v in input_dict.items() if v != 0 and v != 0.0]
        print(f"Non-default fields received: {non_default_fields}")
        return predict(model_key, input_data)
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Invalid input data: {str(e)}")