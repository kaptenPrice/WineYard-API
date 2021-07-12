import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT;
const DB_URL = process.env.DB_URL;

const connectToDB = async () => {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify:false
    });
    console.log('***__--__SUCCESSFULLY CONNECTED TO MONGO_Db__--__***');
  } catch (error) {
    console.log('ERROR WHILE TRY CONNECTING TO DB', error);
    process.exit();
  }
};

const connectToPort = (app) => {
  app.listen(port, () => {
    console.log(`__ THE LONELY SERVER IS UP AND RUNNING ON __ ${port}`);
  });
};

export default { connectToDB, connectToPort };
