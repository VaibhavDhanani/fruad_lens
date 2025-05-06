import numpy as np
import pandas as pd
from tqdm import tqdm

# Set random seed for reproducibility
np.random.seed(42)

# Number of samples per class
N_SAMPLES_PER_CLASS = 50000

# Lists to hold data
data = []

def compute_risk_score(row):
    score = 0

    def scaled_score(val, low, high, max_score):
        val = max(min(val, high), low)
        return ((val - low) / (high - low)) * max_score

    score += 5 * row['Suspicious_IP_Flag']

    # IP Address Flag: 1 (low risk), 2 (medium), 3 (high)
    score += scaled_score(row['IP_Address_Flag'], 1, 3, 10)

    # Previous Fraudulent Activity (binary)
    score += 5 * row['Previous_Fraudulent_Activity']

    # Transaction Amount vs Avg Amount (risk if 10x to 100x)
    ratio_amt = row['Transaction_Amount'] / (row['Avg_Transaction_Amount_7d'] + 1)
    score += scaled_score(ratio_amt, 1, 100, 10)

    # Failed Transaction Count in 7 days (risk starts from 20–100)
    score += scaled_score(row['Failed_Transaction_Count_7d'], 20, 100, 10)

    # Transaction Distance vs Avg (risk from 5x–50x)
    ratio_dist = row['Transaction_Distance'] / (row['Avg_Transaction_Distance'] + 1)
    score += scaled_score(ratio_dist, 1, 50, 10)

    # Multiple account logins (risk from 2–10 logins)
    score += scaled_score(row['Multiple_Account_Login'], 2, 10, 10)

    # Transaction location mismatch (binary)
    score += 5 * row['Transaction_Location_Flag']

    return score



def generate_sample():
    Transaction_Amount = np.random.uniform(10, 1_000_000)
    IP_Address_Flag = np.random.choice([1, 2, 3], p=[0.5, 0.3, 0.2])
    Previous_Fraudulent_Activity = np.random.randint(0, 2)
    Daily_Transaction_Count = np.random.randint(1, 500)
    Avg_Transaction_Amount_7d = np.random.uniform(10, 100_000)
    Failed_Transaction_Count_7d = np.random.randint(0, 500)
    Transaction_Distance = np.random.uniform(1, 1000)
    Avg_Transaction_Distance = np.random.uniform(1, 100)
    Monthly_Transaction_Count = np.random.randint(1, 1000)
    Transaction_Location_Flag = np.random.randint(0, 2)
    Suspicious_IP_Flag = np.random.randint(0, 2)
    Multiple_Account_Login = np.random.randint(0, 20)

    row = {
        "Transaction_Amount": Transaction_Amount,
        "IP_Address_Flag": IP_Address_Flag,
        "Previous_Fraudulent_Activity": Previous_Fraudulent_Activity,
        "Daily_Transaction_Count": Daily_Transaction_Count,
        "Avg_Transaction_Amount_7d": Avg_Transaction_Amount_7d,
        "Failed_Transaction_Count_7d": Failed_Transaction_Count_7d,
        "Transaction_Distance": Transaction_Distance,
        "Avg_Transaction_Distance": Avg_Transaction_Distance,
        "Monthly_Transaction_Count": Monthly_Transaction_Count,
        "Transaction_Location_Flag": Transaction_Location_Flag,
        "Suspicious_IP_Flag": Suspicious_IP_Flag,
        "Multiple_Account_Login": Multiple_Account_Login
    }

    risk_score = compute_risk_score(row)
    is_fraud = 1 if risk_score > 7.0 else 0

    return list(row.values()) + [is_fraud]

# Progress bar
pbar = tqdm(total=2 * N_SAMPLES_PER_CLASS, desc="Generating Samples")

fraud_count = 0
nonfraud_count = 0

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
    "Transaction_Amount", "IP_Address_Flag", "Previous_Fraudulent_Activity", "Daily_Transaction_Count",
    "Avg_Transaction_Amount_7d", "Failed_Transaction_Count_7d", "Transaction_Distance",
    "Avg_Transaction_Distance", "Monthly_Transaction_Count", "Transaction_Location_Flag",
    "Suspicious_IP_Flag", "Multiple_Account_Login", "is_fraud"
]

df = pd.DataFrame(data, columns=columns)
df = df.sample(frac=1).reset_index(drop=True)
df.to_csv("synthetic_fraud_dataset1.csv", index=False)

print("✅ Dataset saved as 'synthetic_fraud_dataset.csv'")