import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  hashed_password: { type: String, required: true },
  full_name: String,
  gender: String,
  pan_card: { type: String, unique: true, required: false },
  balance: { type: Number, default: 50000 } // 💰 Added balance field
}, { timestamps: true });

export default mongoose.model('User', userSchema);
