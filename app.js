const express = require("express");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const helmet = require("helmet");
const AppError = require("./utils/error");
const globalErrorHandler = require("./controllers/errorController");
const authController = require("./controllers/authController");
const app = express();

app.use(helmet()); //security headers are the first middleware

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); //logging
}

const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP. Please try again later",
});

app.use(limiter); //if server is restarted the limiter is reset
app.use(express.json({ limit: "10kb" })); //allows json requests 7 limit size
app.use(express.static("./public")); // serves html files from /public
app.use(express.urlencoded({ extended: true })); //allows incoming strings/arrs

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const deviceRouter = require("./routes/deviceRouter");
const configRouter = require("./routes/configRouter");
const userRouter = require("./routes/userRouter");

//API
app.use("/config", configRouter);

app.use("/devices", deviceRouter);

app.use("/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
