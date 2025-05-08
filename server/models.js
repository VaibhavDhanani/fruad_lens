const API_BASE_URL = 'http:13.127.98.0/fastapi'; // Update if deployed elsewhere

// Model configurations (for metadata only)
const models = {
  mayank: {
    name: 'Mayank Model'
  },
  yash_amount: {
    name: 'Yash with Amount Model'
  },
  yash_ratio: {
    name: 'Yash with Ratio Model'
  }
};

// Map frontend field names to backend field names if needed
// This mapping ensures field names match what the backend expects
const fieldNameMapping = {
  // Example: if your form has a field named differently than the backend expects
  // 'frontendFieldName': 'backend_field_name'
  'is_night': 'is_night',  // These are correctly named already
  'ip_address_flag': 'ip_address_flag'
  // Add any other fields that need explicit mapping
};

// Predict fraud using FastAPI backend
export async function predictFraud(modelType, inputData) {
  const modelConfig = models[modelType];
  if (!modelConfig) {
    throw new Error(`Model ${modelType} not found`);
  }

  // Convert data to the format expected by the backend
  const processedData = {};
  
  for (const key in inputData) {
    let value = inputData[key];
    
    // Skip null or undefined values
    if (value === null || value === undefined) {
      console.warn(`Skipping null or undefined value for field: ${key}`);
      continue;
    }

    // Convert booleans to integers (1/0)
    if (typeof value === 'boolean') {
      value = value ? 1 : 0;
    }
    
    // Use the mapped field name if it exists, otherwise use the original key
    // This ensures field names match what the backend expects
    const backendFieldName = fieldNameMapping[key] || key.toLowerCase();
    processedData[backendFieldName] = value;
  }

  // Log the data being sent to the API
  console.log(`Sending data to model ${modelType}:`, {
    model_name: modelConfig.name,
    features_used: Object.keys(processedData).length,
    fields: processedData
  });

  try {
    const response = await fetch(`${API_BASE_URL}/predict/${modelType}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(processedData)
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`API error: ${response.status} - ${err}`);
    }

    const result = await response.json();

    // Log the result for debugging
    console.log("Prediction result:", result);
console.log(result.is_fraud)
    return {
      is_fraud: result.is_fraud,
      probability: result.probability,
      model_name: modelConfig.name,
      features_used: Object.keys(processedData).length
    };
  } catch (error) {
    console.error(`Error predicting with model ${modelType}:`, error);
    throw error;
  }
}

export { models };