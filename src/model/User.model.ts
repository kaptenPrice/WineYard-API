import { BinaryLike } from 'crypto';
import mongoose from 'mongoose';
import { WineSchema, IWine } from './Wine.model';

const UserSchema = new mongoose.Schema(
	{
		hash: String,
		salt: String,
		email: String,
		favoriteWines: [WineSchema],
		admin: Boolean,
		resetPasswordToken: String,
		resetPasswordExpires: Date
	},
	{
		timestamps: true
	}
);

const UserModel = mongoose.model<IUser>('user', UserSchema);

export default UserModel;
export interface IUser extends mongoose.Document {
	hash: BinaryLike;
	salt: BinaryLike;
	email: string | null;
	favoriteWines: Array<IWine> | Array<null> ;
	admin: Boolean | null;
	resetPasswordToken?: mongoose.Types.ObjectId | null;
	resetPasswordExpires?: number | null;
}
