import { BinaryLike } from 'crypto';
import { Schema, model, Document, Types } from 'mongoose';
import { IWine } from './Wine.model';
import uniqueValidator from 'mongoose-unique-validator';

const UserSchema = new Schema(
	{
		hash: String,
		salt: String,
		email: {
			type: String,
			unique: true,
			match: [
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				'Please fill a valid email address'
			]
		},
		favoriteWines: [
			{
				name: {
					type: String,
					required: true
				},
				country: { type: String, required: true },
				description: { type: String },
				grapes: { type: String },
				year: { type: String },
				avatar: { type: String }
			},
			{
				timestamps: false
			}
		],
		admin: Boolean,
		resetPasswordToken: String,
		resetPasswordExpires: Date
	},
	{
		timestamps: true
	}
);
UserSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

const UserModel = model<IUser>('user', UserSchema);

export default UserModel;
export interface IUser extends Document {
	hash: BinaryLike;
	salt: BinaryLike;
	email: string | null;
	favoriteWines: Array<IWine> | Array<null>;
	admin: Boolean | null;
	resetPasswordToken?: Types.ObjectId | null;
	resetPasswordExpires?: number | null;
}
