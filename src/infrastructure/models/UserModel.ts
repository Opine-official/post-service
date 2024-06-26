import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  profile: {
    type: String,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },

  tokenVersion: {
    type: Number,
    default: 0,
  },
});

export const UserModel = mongoose.model('User', UserSchema);
