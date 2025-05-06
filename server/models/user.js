import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  hashed_password: { type: String, required: true },
  full_name: String,
  gender: String,
  aadhar_card: { type: String, unique: true },
  pan_card: { type: String, unique: true },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
