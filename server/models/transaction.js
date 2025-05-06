import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // who performed the action
  counterparty: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // the other person
  device_id: String,
  transaction_amount: { type: Number, required: true },
  transaction_type: { type: String, enum: ['DEBIT', 'CREDIT'], required: true },
  description: { type: String },

  timestamp: { type: Date, default: Date.now },
  transaction_hour: Number,
  is_weekend: Boolean,
  beneficiary_account_number: String,
  sender_lat: Number,
  sender_long: Number,
  beneficiary_lat: Number,
  beneficiary_long: Number,
  ip_address: String,
  is_fraud: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);  // Use export default
