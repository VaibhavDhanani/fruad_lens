import xgboost from 'xgboost';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load the XGBoost models
const loadModel = async (modelPath) => {
  try {
    const model = new xgboost.Booster();
    await model.loadModel(modelPath);
    return model;
  } catch (error) {
    console.error(`Error loading model from ${modelPath}:`, error);
    throw error;
  }
};

// Model configurations
const models = {
  'mayank': {
    name: 'Mayank Model',
    features: [
      "IP_Address_Flag", "Previous_Fraudulent_Activity", "Daily_Transaction_Count",
      "Failed_Transaction_Count_7d", "Account_Age", "Transaction_Distance", "Is_Weekend",
      "IsNight", "Time_Since_Last_Transaction", "Distance_Avg_Transaction_7d",
      "Transaction_To_Balance_Ratio"
    ],
    feature_types: ["int", "int", "int", "int", "int", "float", "int", "int", "int", "float", "float"],
    model: null
  },
  'yash_amount': {
    name: 'Yash with Amount Model',
    features: [
      "Transaction_Amount", "IP_Address_Flag", "Previous_Fraudulent_Activity",
      "Daily_Transaction_Count", "Avg_Transaction_Amount_7d", "Failed_Transaction_Count_7d",
      "Transaction_Distance", "Avg_Transaction_Distance", "Monthly_Transaction_Count",
      "Transaction_Location_Flag", "Suspicious_IP_Flag", "Multiple_Account_Login"
    ],
    feature_types: ["float", "int", "int", "int", "float", "int", "float", "float", "int", "int", "int", "int"],
    model: null
  },
  'yash_ratio': {
    name: 'Yash with Ratio Model',
    features: [
      "IP_Address_Flag", "Previous_Fraudulent_Activity", "Transaction_Amount_Ratio",
      "Failed_Transaction_Rate", "Transaction_Distance_Ratio", "Transaction_Count_Ratio",
      "Multiple_Account_Login", "Transaction_Location_Flag", "Suspicious_IP_Flag"
    ],
    feature_types: ["int", "int", "float", "float", "float", "float", "int", "int", "int"],
    model: null
  }
};

// Initialize models
const initializeModels = async () => {
  try {
    for (const [modelType, modelConfig] of Object.entries(models)) {
      const modelPath = path.join(__dirname, 'AI-models', `${modelType}.json`);
      modelConfig.model = await loadModel(modelPath);
    }
    console.log('All models loaded successfully');
  } catch (error) {
    console.error('Error initializing models:', error);
    throw error;
  }
};

// Map form data fields to model feature names
const formToModelFieldMap = {
  ip_address_flag: "IP_Address_Flag",
  previous_fraudulent_activity: "Previous_Fraudulent_Activity",
  daily_transaction_count: "Daily_Transaction_Count",
  failed_transaction_count_7d: "Failed_Transaction_Count_7d",
  account_age: "Account_Age",
  transaction_distance: "Transaction_Distance",
  is_weekend: "Is_Weekend",
  is_night: "IsNight",
  time_since_last_transaction: "Time_Since_Last_Transaction",
  distance_avg_transaction_7d: "Distance_Avg_Transaction_7d",
  transaction_to_balance_ratio: "Transaction_To_Balance_Ratio",
  transaction_amount: "Transaction_Amount",
  avg_transaction_amount_7d: "Avg_Transaction_Amount_7d",
  avg_transaction_distance: "Avg_Transaction_Distance",
  monthly_transaction_count: "Monthly_Transaction_Count",
  transaction_location_flag: "Transaction_Location_Flag",
  suspicious_ip_flag: "Suspicious_IP_Flag",
  multiple_account_login: "Multiple_Account_Login",
  transaction_amount_ratio: "Transaction_Amount_Ratio",
  failed_transaction_rate: "Failed_Transaction_Rate",
  transaction_distance_ratio: "Transaction_Distance_Ratio",
  transaction_count_ratio: "Transaction_Count_Ratio"
};

// Predict fraud using XGBoost model
export async function predictFraud(modelType, inputData) {
  const modelConfig = models[modelType];
  if (!modelConfig || !modelConfig.model) {
    throw new Error(`Model ${modelType} not found or not initialized`);
  }

  const features = modelConfig.features.map((feature, index) => {
    const formField = Object.entries(formToModelFieldMap)
      .find(([_, value]) => value === feature)?.[0];

    if (formField === undefined) {
      throw new Error(`Cannot map model feature ${feature} to a form field`);
    }

    let value = inputData[formField];

    if (typeof value === 'boolean') {
      value = value ? 1 : 0;
    }

    const featureType = modelConfig.feature_types[index];
    return featureType === 'float' ? parseFloat(value) : parseInt(value);
  });

  try {
    const dmat = await xgboost.DMatrix.fromArray(features);
    const predictions = await modelConfig.model.predict(dmat);
    const probability = predictions[0];

    return {
      is_fraud: probability > 0.5,
      probability,
      model_name: modelConfig.name,
      features_used: modelConfig.features.length
    };
  } catch (error) {
    console.error(`Error predicting with model ${modelType}:`, error);
    throw error;
  }
}

// Load models immediately
await initializeModels();

// Export models if needed
export { models  };
