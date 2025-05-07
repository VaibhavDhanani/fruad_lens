import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // who performed the action
  counterparty: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional
  
  transaction_amount: { type: Number, required: true },
  transaction_type: { type: String, enum: ['DEBIT', 'CREDIT'], required: true },
  description: { type: String },

  status: { type: String, enum: ['SUCCESS', 'PENDING','FAILED'], required: true },

  account_balance: { type: Number }, 
  ip_address: { type: String },
  ip_address_flag: { type: Boolean, default: 0 }, 

  previous_fraudulent_activity: { type: Number, default: 0 }, 
  daily_transaction_count: { type: Number, default: 0 }, 
  avg_transaction_amount_7d: { type: Number, default: 0 }, 
  failed_transaction_count_7d: { type: Number, default: 0 }, 
  account_age: { type: Number }, 

  timestamp: { type: Date, default: Date.now },
  transaction_hour: Number,
  is_weekend: Boolean,
  is_night: { type: Boolean }, 

  time_since_last_transaction: { type: Number, default: 0 }, 
  transaction_to_balance_ratio: { type: Number, default: 0 }, 

  sender_lat: Number,
  sender_long: Number,
  beneficiary_lat: Number,
  beneficiary_long: Number,
  transaction_distance: { type: Number }, // 🆕 Haversine distance between sender & beneficiary
  distance_avg_transaction_7d: { type: Number, default: 0 }, // 🆕 average past distances

  is_fraud: { type: Boolean, default: false }
}, { timestamps: true });


export default mongoose.model('Transaction',transactionSchema );
