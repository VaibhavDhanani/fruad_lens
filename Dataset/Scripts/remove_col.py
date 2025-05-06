import pandas as pd

# Load the balanced dataset
df = pd.read_csv("fraud_detect_final.csv")

# Drop the specified columns if they exist
columns_to_drop = ["Account_Balance","Transaction_Hour","Time_Since_Last_Transaction"]
df.drop(columns=[col for col in columns_to_drop if col in df.columns], inplace=True)

# Save the updated dataset
df.to_csv("cleaned_fraud_dataset.csv", index=False)
print("[INFO] Cleaned dataset saved as 'cleaned_fraud_dataset.csv'")
