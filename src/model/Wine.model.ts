import mongoose, { Schema, Types } from 'mongoose';

export const WineSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		country: { type: String, required: true },
		description: { type: String },
		grapes: { type: String },
		year: { type: String },
		likedBy: [Schema.Types.ObjectId],
		avatar: { type: String, require: false },
		addedByUser: { type: String }
	},
	{
		timestamps: true
	}
);

const WineModel = mongoose.model<IWine>('wines', WineSchema);
export default WineModel;

export interface IWine extends mongoose.Document {
	name: string | null;
	country: string | null;
	description: string | null;
	grapes: string | null;
	year: string | null;
	timestamps: Date;
	likedBy: Array<string>;
	avatar: string;
	addedByUser: string;
}
