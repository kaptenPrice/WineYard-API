import mongoose from 'mongoose';
import { WineSchema } from './Wine.model.js';

const UserSchema = mongoose.Schema(
  {
    nickname: String,
    email: { type: String, unique: true },
    favoriteWines: [WineSchema],
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model('user', UserSchema);

export default UserModel;
