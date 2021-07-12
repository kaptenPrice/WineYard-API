import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import middleWares from './src/middleware/MiddleWares.js';
import Configuration from './config/Configuration.js';
import UserRoutes from "./src/routes/User.routes.js"
const __dirname = path.resolve();

const app = express();

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(helmet());
app.use(
  morgan('common', {
    stream: fs.createWriteStream(path.join(__dirname, 'access.log'), {
      flags: 'a',
    }),
  })
);

app.get('/recipe', (req, res) => {
  res.send({ user: 'Xlatan' });
});

Configuration.connectToDB();
Configuration.connectToPort(app);

// app.get('/user', isAuth, (req, res) => {});
UserRoutes.routes(app)


app.use(middleWares.notFound);
app.use(middleWares.errorHandler);
