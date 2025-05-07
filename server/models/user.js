import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  full_name: String,
  gender: String,
  pan_card: { type: String, required: false },
  balance: { type: Number, default: 50000 },
  mpin: { 
    type: String, 
    required: true, 
    minlength: 6, 
    maxlength: 6, 
    validate: {
      validator: function(v) {
        return /^\d{6}$/.test(v);
      },
      message: props => `${props.value} is not a valid 6-digit MPIN!`
    }
  },
  latest_login: { type: Date, required: false } // 👈 New field
}, { timestamps: true });


export default mongoose.model('User', userSchema);
