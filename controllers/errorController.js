const AppError = require("../utils/error");

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log("❗ Error", err);
    res.status(500).json({ status: "error", message: "Something went wrong" });
  }
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} with value ${err.value}`;
  return new AppError(message, 400);
};
const handleDuplicateDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value - {${err.path}: ${err.value}}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors.map((el) => el.message));
  const message = "Invalid input data";
  return new AppError(message, 400);
};

const handleJWTError = (error) => new AppError("Invalid Token. Please log in", 401);
const handleJWTExpiredError = (error) => new AppError("Token expired. Please log in again", 401);

module.exports = (err, req, res, next) => {
  let error = { ...err };
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") if (error.name === "CastError") error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === "ValidationError") error = handleValidationErrorDB(error);
  if (error.name === "JsonWebTokenError") error = handleJWTError(error);
  if (error.name === "TokenExpiredError") error = handleJWTExpiredError(error);
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
