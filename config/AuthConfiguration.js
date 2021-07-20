import dotenv from 'dotenv';
import DBConfiguration from "./DBConfiguration.js"

dotenv.config();

export const AUTHCONFIG = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
};

export const SESSIONCONFIG = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: DBConfiguration.sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
  },
};
// export default { AUTHCONFIG };
