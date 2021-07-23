import mongoose from 'mongoose'
// import uniqueValidator from 'mongoose-unique-validator'
import { WineSchema } from './Wine.model.js'

const UserSchema = mongoose.Schema(
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
)
// UserSchema.plugin(uniqueValidator)

const UserModel = mongoose.model('user', UserSchema)

export default UserModel
