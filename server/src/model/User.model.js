import mongoose from 'mongoose';

const UserSchema = mongoose.Schema(
  {
    username: String,
    password: String,
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model('user', UserSchema);

export default UserModel;
