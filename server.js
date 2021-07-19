import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import MongoStore from 'connect-mongo';

import middleWares from './src/middleware/MiddleWares.js';
import DBConfiguration from './config/DBConfiguration.js';
import UserRoutes from './src/routes/User.routes.js';
import './config/passport.js';

// const { auth } = AUTH0;
const __dirname = path.resolve();

const app = express();

// app.use(auth(AuthConfiguration.AUTHCONFIG));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(cookieParser());

//Move to DBConfiguration if keep
const sessionStore =  MongoStore.create({
  mongoUrl: process.env.DB_URL,
  dbName: 'winelistapi',
  collectionName:"sessions"
});
//Move to middlewares if keep
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore, 
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

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

/**const checkJwt = jwt({
  secret: JwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: 'https://dev-z5d78tfc.eu.auth0.com/.well-known/jwks.json'
}),
audience: 'https://wine-api',
issuer: 'https://dev-z5d78tfc.eu.auth0.com/',
algorithms: ['RS256']
}); */
// app.get('/', (req, res) => {
//   res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
// });

// app.get('/profile', requiresAuth(), (req, res) => {
//   res.send(JSON.stringify(req.oidc.user));
// });
// app.use(cors({ origin: true, credentials: true }));
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   next();
// });
// app.use(checkJwt);
