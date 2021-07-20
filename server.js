import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';

import middleWares from './src/middleware/MiddleWares.js';
import DBConfiguration from './config/DBConfiguration.js';
import UserRoutes from './src/routes/User.routes.js';
import './config/passport.js'; //TODO passport ska importeras här

import { SESSIONCONFIG } from './config/AuthConfiguration.js';

// const { auth } = AUTH0;
const __dirname = path.resolve();

const app = express();

// app.use(auth(AuthConfiguration.AUTHCONFIG));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(cookieParser());


app.use(session(SESSIONCONFIG));

app.use(
  morgan('common', {
    stream: fs.createWriteStream(path.join(__dirname, 'access.log'), {
      flags: 'a',
    }),
  })
);

DBConfiguration.connectToDB();
DBConfiguration.connectToPort(app);

//Keep the authentication fresh
app.use(passport.initialize());
app.use(passport.session());


UserRoutes.routes(app);

app.use(middleWares.notFound);
app.use(middleWares.errorHandler);

export default app;

