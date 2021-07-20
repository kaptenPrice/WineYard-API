import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT;
const DB_URL = process.env.DB_URL;

const connectToDB = async () => {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log('***SUCCESSFULLY CONNECTED TO MONGO_DB***');
  } catch (error) {
    console.log('ERROR WHILE TRY CONNECTING TO DB', error);
    process.exit();
  }
};
//TODO neccessary to intit the dbName?
const sessionStore = MongoStore.create({
  mongoUrl: process.env.DB_URL,
});

const connectToPort = (app) => {
  app.listen(port, () => {
    console.log(`__ THE LONELY SERVER IS UP AND RUNNING ON __ ${port}`);
  });
};

export default { connectToDB, connectToPort, sessionStore };
