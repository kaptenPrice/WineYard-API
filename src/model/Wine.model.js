import mongoose from 'mongoose';
//import uniqueValidator from 'mongoose-unique-validator';

export const WineSchema = mongoose.Schema(
  {
    wineName: {
      type: String,
      required: true,
      //unique: true,
    },
    country: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// WineSchema.plugin(uniqueValidator);

const WineModel = mongoose.model('wines', WineSchema);
export default WineModel;
