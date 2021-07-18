import mongoose from 'mongoose';
//import uniqueValidator from 'mongoose-unique-validator';

export const WineSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    country: { type: String, required: true },
    description: { type: String },
    grapes: { type: String },
    name: { type: String },
    year: { type: String },
  },

  {
    timestamps: true,
  }
);

// WineSchema.plugin(uniqueValidator);

const WineModel = mongoose.model('wines', WineSchema);
export default WineModel;
