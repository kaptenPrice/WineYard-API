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
    stacktrace:
      process.env.ENVIROMENT === 'PRODUCTION'
        ? 'READ API ROUTS...'
        : error.stack,
  });
};



export const objectFilter = (obj, preventedValue) => {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([key, value]) => !preventedValue.includes(value))
      .map(([key, value]) => {
        try {
          return [key, value.trim()];
        } catch (error) {
          return [key, value];
        }
      })
  );
};

export default { notFound, errorHandler };
