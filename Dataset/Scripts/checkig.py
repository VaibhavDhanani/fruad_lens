import pandas as pd

# Load your dataset
df = pd.read_csv('synthetic_fraud_dataset.csv')



# Ensure Fraud_Type is string
df['Fraud_Type'] = df['Fraud_Type'].astype(str)

# Split and explode
df['Fraud_Type'] = df['Fraud_Type'].str.split(';')
df_exploded = df.explode('Fraud_Type')

# Count all fraud types, including 0
fraud_type_counts = df_exploded['Fraud_Type'].value_counts()

# Show result
print("Number of entries per fraud type (including 0):")
print(fraud_type_counts)

