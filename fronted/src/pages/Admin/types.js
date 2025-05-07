// Define types for model and form data
export const MODEL_TYPES = {
    MAYANK: 'mayank',
    YASH_AMOUNT: 'yash_amount',
    YASH_RATIO: 'yash_ratio'
  };
  
  // Form data structure for all models
  export const DEFAULT_FORM_DATA = {
    // Common inputs across models
    ip_address_flag: 1,
    previous_fraudulent_activity: false,
    daily_transaction_count: 5,
    failed_transaction_count_7d: 0,
    transaction_distance: 10.0,
    
    // mayank model specific
    account_age: 365,
    is_weekend: false,
    is_night: false,
    time_since_last_transaction: 120,
    distance_avg_transaction_7d: 15.0,
    transaction_to_balance_ratio: 0.1,
    
    // yash_amount model specific
    transaction_amount: 100.0,
    avg_transaction_amount_7d: 200.0,
    avg_transaction_distance: 20.0,
    monthly_transaction_count: 30,
    transaction_location_flag: false,
    suspicious_ip_flag: false,
    multiple_account_login: 1,
    
    // yash_ratio model specific
    transaction_amount_ratio: 0.5,
    failed_transaction_rate: 0.05,
    transaction_distance_ratio: 0.8,
    transaction_count_ratio: 0.6,
  };
  
  // Field to model mapping
  export const FIELD_TO_MODEL_MAP = {
    // Common fields
    ip_address_flag: [MODEL_TYPES.MAYANK, MODEL_TYPES.YASH_AMOUNT, MODEL_TYPES.YASH_RATIO],
    previous_fraudulent_activity: [MODEL_TYPES.MAYANK, MODEL_TYPES.YASH_AMOUNT, MODEL_TYPES.YASH_RATIO],
    daily_transaction_count: [MODEL_TYPES.MAYANK, MODEL_TYPES.YASH_AMOUNT],
    failed_transaction_count_7d: [MODEL_TYPES.MAYANK, MODEL_TYPES.YASH_AMOUNT],
    transaction_distance: [MODEL_TYPES.MAYANK, MODEL_TYPES.YASH_AMOUNT],
    
    // mayank specific
    account_age: [MODEL_TYPES.MAYANK],
    is_weekend: [MODEL_TYPES.MAYANK],
    is_night: [MODEL_TYPES.MAYANK],
    time_since_last_transaction: [MODEL_TYPES.MAYANK],
    distance_avg_transaction_7d: [MODEL_TYPES.MAYANK],
    transaction_to_balance_ratio: [MODEL_TYPES.MAYANK],
    
    // yash_amount specific
    transaction_amount: [MODEL_TYPES.YASH_AMOUNT],
    avg_transaction_amount_7d: [MODEL_TYPES.YASH_AMOUNT],
    avg_transaction_distance: [MODEL_TYPES.YASH_AMOUNT],
    monthly_transaction_count: [MODEL_TYPES.YASH_AMOUNT],
    transaction_location_flag: [MODEL_TYPES.YASH_AMOUNT, MODEL_TYPES.YASH_RATIO],
    suspicious_ip_flag: [MODEL_TYPES.YASH_AMOUNT, MODEL_TYPES.YASH_RATIO],
    multiple_account_login: [MODEL_TYPES.YASH_AMOUNT, MODEL_TYPES.YASH_RATIO],
    
    // yash_ratio specific
    transaction_amount_ratio: [MODEL_TYPES.YASH_RATIO],
    failed_transaction_rate: [MODEL_TYPES.YASH_RATIO],
    transaction_distance_ratio: [MODEL_TYPES.YASH_RATIO],
    transaction_count_ratio: [MODEL_TYPES.YASH_RATIO],
  };
  
  // Result structure for model predictions
  export const SAMPLE_RESULTS = {
    [MODEL_TYPES.MAYANK]: { 
      is_fraud: false,
      probability: 0.15,
      model_name: "Mayank Model",
      features_used: 11
    },
    [MODEL_TYPES.YASH_AMOUNT]: {
      is_fraud: true,
      probability: 0.78,
      model_name: "Yash with Amount Model",
      features_used: 12
    },
    [MODEL_TYPES.YASH_RATIO]: {
      is_fraud: false,
      probability: 0.32,
      model_name: "Yash with Ratio Model",
      features_used: 9
    }
  };