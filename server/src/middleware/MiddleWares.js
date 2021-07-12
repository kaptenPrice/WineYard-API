import dotenv from 'dotenv';

dotenv.config();

const notFound = (req, res, next) => {
  const error = new Error(`Not found ${req.originalUrl}`);
  res.status(404);
  next(error);
};
const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    statusCode: statusCode,
    message: error.message,
    stacktrace: process.env.ENVIROMENT === 'PRODUCTION' ? 'lol' : error.stack,
  });
};

// function isAuth(req, res, next) {
//   req.query.admin === 'true'
//     ? res.send('You are ADMIN')
//     : res.send(`YOU CAN GO TO HELL ${req.query.admin}`);
//   next();
// }
// MIDDLEWARE FUNCTION: if requested endpoint dosnt exist

export default { notFound, errorHandler };
