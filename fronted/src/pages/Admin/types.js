// Define types for model and form data
export const MODEL_TYPES = {
  XGB_11: 'xgb_11',
  XGB_12: 'xgb_12',
  XGB_9: 'xgb_9'
};

// Form data structure for all models
export const DEFAULT_FORM_DATA = {
  // Common inputs across models
  ip_address_flag: 1,
  previous_fraudulent_activity: false,
  daily_transaction_count: 5,
  failed_transaction_count_7d: 0,
  transaction_distance: 10.0,

  // XGB_11 (was Mayank) specific
  account_age: 365,
  is_weekend: false,
  is_night: false,
  time_since_last_transaction: 120,
  distance_avg_transaction_7d: 15.0,
  transaction_to_balance_ratio: 0.1,

  // XGB_12 (was Yash Amount) specific
  transaction_amount: 100.0,
  avg_transaction_amount_7d: 200.0,
  avg_transaction_distance: 20.0,
  monthly_transaction_count: 30,
  transaction_location_flag: false,
  suspicious_ip_flag: false,
  multiple_account_login: 1,

  // XGB_9 (was Yash Ratio) specific
  transaction_amount_ratio: 0.5,
  failed_transaction_rate: 0.05,
  transaction_distance_ratio: 0.8,
  transaction_count_ratio: 0.6,
};

// Field to model mapping
export const FIELD_TO_MODEL_MAP = {
  // Common fields
  ip_address_flag: [MODEL_TYPES.XGB_11, MODEL_TYPES.XGB_12, MODEL_TYPES.XGB_9],
  previous_fraudulent_activity: [MODEL_TYPES.XGB_11, MODEL_TYPES.XGB_12, MODEL_TYPES.XGB_9],
  daily_transaction_count: [MODEL_TYPES.XGB_11, MODEL_TYPES.XGB_12],
  failed_transaction_count_7d: [MODEL_TYPES.XGB_11, MODEL_TYPES.XGB_12],
  transaction_distance: [MODEL_TYPES.XGB_11, MODEL_TYPES.XGB_12],

  // XGB_11 specific
  account_age: [MODEL_TYPES.XGB_11],
  is_weekend: [MODEL_TYPES.XGB_11],
  is_night: [MODEL_TYPES.XGB_11],
  time_since_last_transaction: [MODEL_TYPES.XGB_11],
  distance_avg_transaction_7d: [MODEL_TYPES.XGB_11],
  transaction_to_balance_ratio: [MODEL_TYPES.XGB_11],

  // XGB_12 specific
  transaction_amount: [MODEL_TYPES.XGB_12],
  avg_transaction_amount_7d: [MODEL_TYPES.XGB_12],
  avg_transaction_distance: [MODEL_TYPES.XGB_12],
  monthly_transaction_count: [MODEL_TYPES.XGB_12],
  transaction_location_flag: [MODEL_TYPES.XGB_12, MODEL_TYPES.XGB_9],
  suspicious_ip_flag: [MODEL_TYPES.XGB_12, MODEL_TYPES.XGB_9],
  multiple_account_login: [MODEL_TYPES.XGB_12, MODEL_TYPES.XGB_9],

  // XGB_9 specific
  transaction_amount_ratio: [MODEL_TYPES.XGB_9],
  failed_transaction_rate: [MODEL_TYPES.XGB_9],
  transaction_distance_ratio: [MODEL_TYPES.XGB_9],
  transaction_count_ratio: [MODEL_TYPES.XGB_9],
};

// Result structure for model predictions
export const SAMPLE_RESULTS = {
  [MODEL_TYPES.XGB_11]: {
    is_fraud: false,
    probability: 0.15,
    model_name: "XGB 11",
    features_used: 11
  },
  [MODEL_TYPES.XGB_12]: {
    is_fraud: true,
    probability: 0.78,
    model_name: "XGB 12",
    features_used: 12
  },
  [MODEL_TYPES.XGB_9]: {
    is_fraud: false,
    probability: 0.32,
    model_name: "XGB 9",
    features_used: 9
  }
};
