import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // who performed the action
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // the other person
  transaction_amount: { type: Number, required: true },
  description: { type: String },
  timestamp: { type: Date, default: Date.now },
  
  status: { type: String, enum: ['SUCCESS', 'FAILED'], required: true }, // NEW FIELD

  device_id: String,
  sender_lat: Number,
  sender_long: Number,
  beneficiary_lat: Number,
  beneficiary_long: Number,
  ip_address: String,
  is_fraud: { type: Boolean, default: false },

  
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);
