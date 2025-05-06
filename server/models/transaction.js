import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  device_id: String,
  transaction_amount: Number,
  timestamp: { type: Date, default: Date.now },
  transaction_hour: Number,
  is_weekend: Boolean,
  beneficiary_account_number: String,
  sender_lat: Number,
  sender_long: Number,
  beneficiary_lat: Number,
  beneficiary_long: Number,
  ip_address: String
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
