import mongoose from 'mongoose';
// import uniqueValidator from 'mongoose-unique-validator';
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
// UserSchema.plugin(uniqueValidator);

const UserModel = mongoose.model('user', UserSchema);

export default UserModel;
