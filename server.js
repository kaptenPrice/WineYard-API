import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import AUTH0 from 'express-openid-connect';

import middleWares from './src/middleware/MiddleWares.js';
import Configuration from './config/Configuration.js';
import AuthConfiguration from './config/AuthConfiguration.js';
import UserRoutes from './src/routes/User.routes.js';

const { auth } = AUTH0;

const __dirname = path.resolve();

const app = express();


app.use(auth(AuthConfiguration.AUTHCONFIG));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(
  morgan('common', {
    stream: fs.createWriteStream(path.join(__dirname, 'access.log'), {
      flags: 'a',
    }),
  })
);

Configuration.connectToDB();
Configuration.connectToPort(app);

// app.get('/', (req, res) => {
//   res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
// });

// app.get('/profile', requiresAuth(), (req, res) => {
//   res.send(JSON.stringify(req.oidc.user));
// });

UserRoutes.routes(app);

app.use(middleWares.notFound);
app.use(middleWares.errorHandler);

export default app;
