import mongoose from 'mongoose';

export const WineSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    country: { type: String, required: true },
    description: { type: String },
    grapes: { type: String },
    year: { type: String },
  },
  {
    timestamps: true,
  }
);

const WineModel = mongoose.model('wines', WineSchema);
export default WineModel;
