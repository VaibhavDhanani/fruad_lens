const API_BASE_URL = 'http:13.127.98.0/fastapi'; // Update if deployed elsewhere

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


const fieldNameMapping = {
  'is_night': 'is_night',  
  'ip_address_flag': 'ip_address_flag'
};

export async function predictFraud(modelType, inputData) {
  const modelConfig = models[modelType];
  if (!modelConfig) {
    throw new Error(`Model ${modelType} not found`);
  }

  const processedData = {};
  
  for (const key in inputData) {
    let value = inputData[key];
    
    if (value === null || value === undefined) {
      console.warn(`Skipping null or undefined value for field: ${key}`);
      continue;
    }

    if (typeof value === 'boolean') {
      value = value ? 1 : 0;
    }
    
   
    const backendFieldName = fieldNameMapping[key] || key.toLowerCase();
    processedData[backendFieldName] = value;
  }

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