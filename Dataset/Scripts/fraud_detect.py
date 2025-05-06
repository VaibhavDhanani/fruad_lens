import numpy as np
import pandas as pd
from tqdm import tqdm

np.random.seed(42)
N_SAMPLES_PER_CLASS = 50000
data = []

def compute_risk_score(row):
    score = 0

    def scaled_score(val, low, high, max_score):
        val = max(min(val, high), low)
        return ((val - low) / (high - low)) * max_score

    score += 5 * row['Suspicious_IP_Flag']
    score += scaled_score(row['IP_Address_Flag'], 1, 3, 10)
    score += 5 * row['Previous_Fraudulent_Activity']
    score += scaled_score(row['Transaction_Amount_Ratio'], 1, 100, 10)
    score += scaled_score(row['Failed_Transaction_Rate'], 0.1, 10, 10)
    score += scaled_score(row['Transaction_Distance_Ratio'], 1, 50, 10)
    score += scaled_score(row['Transaction_Count_Ratio'], 0.01, 1, 10)
    score += scaled_score(row['Multiple_Account_Login'], 4, 10, 10)
    score += 5 * row['Transaction_Location_Flag']

    return score

def generate_sample():
    amount = np.random.uniform(10, 1_000_000)
    avg_amount = np.random.uniform(10, 100_000)
    distance = np.random.uniform(1, 1000)
    avg_distance = np.random.uniform(1, 100)
    daily_txn = np.random.randint(1, 500)
    monthly_txn = np.random.randint(1, 1000)
    failed_txn = np.random.randint(0, 500)

    row = {
        "IP_Address_Flag": np.random.choice([1, 2, 3], p=[0.5, 0.3, 0.2]),
        "Previous_Fraudulent_Activity": np.random.randint(0, 2),
        "Transaction_Amount_Ratio": amount / (avg_amount + 1),
        "Failed_Transaction_Rate": failed_txn / (daily_txn + 1),
        "Transaction_Distance_Ratio": distance / (avg_distance + 1),
        "Transaction_Count_Ratio": daily_txn / (monthly_txn + 1),
        "Multiple_Account_Login": np.random.randint(0, 20),
        "Transaction_Location_Flag": np.random.randint(0, 2),
        "Suspicious_IP_Flag": np.random.randint(0, 2)
    }

    risk_score = compute_risk_score(row)
    is_fraud = 1 if risk_score > 7.0 else 0

    return list(row.values()) + [is_fraud]


pbar = tqdm(total=2 * N_SAMPLES_PER_CLASS, desc="Generating Samples")
fraud_count = nonfraud_count = 0

while fraud_count < N_SAMPLES_PER_CLASS or nonfraud_count < N_SAMPLES_PER_CLASS:
    sample = generate_sample()
    label = sample[-1]

    if label == 1 and fraud_count < N_SAMPLES_PER_CLASS:
        data.append(sample)
        fraud_count += 1
        pbar.update(1)
    elif label == 0 and nonfraud_count < N_SAMPLES_PER_CLASS:
        data.append(sample)
        nonfraud_count += 1
        pbar.update(1)

pbar.close()

columns = [
    "IP_Address_Flag", "Previous_Fraudulent_Activity", "Transaction_Amount_Ratio",
    "Failed_Transaction_Rate", "Transaction_Distance_Ratio", "Transaction_Count_Ratio",
    "Multiple_Account_Login", "Transaction_Location_Flag", "Suspicious_IP_Flag", "is_fraud"
]

df = pd.DataFrame(data, columns=columns)
df = df.sample(frac=1).reset_index(drop=True)
df.to_csv("synthetic_fraud_dataset.csv", index=False)

print("✅ Dataset saved as 'synthetic_fraud_dataset.csv'")
