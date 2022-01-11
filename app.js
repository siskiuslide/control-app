const express = require("express");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const AppError = require("./utils/error");
const globalErrorHandler = require("./controllers/errorController");
const authController = require("./controllers/authController");
const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//upto 100 requests per hour
const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP. Please try again later",
});

app.use(limiter); //if server is restarted the limiter is reset

app.use(express.json());
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const deviceRouter = require("./routes/deviceRouter");
const configRouter = require("./routes/configRouter");
const userRouter = require("./routes/userRouter");

app.use("/config", configRouter);

app.use("/devices", deviceRouter);

app.use("/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
