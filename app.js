const express = require("express");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const AppError = require("./utils/error");
const globalErrorHandler = require("./controllers/errorController");
const authController = require("./controllers/authController");
const app = express();

app.use(cors());
app.use(helmet()); //security headers are the first middleware

// if (process.env.NODE_ENV === "development") {
app.use(morgan("dev")); //logging
// }

const limiter = rateLimit({
  max: process.env.NODE_ENV === "production" ? 100 : 1000, ///allow more on dev
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP. Please try again later",
});

app.use(limiter); //if server is restarted the limiter is reset

//body parsing
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true })); //allows incoming strings/arrs
app.use(cookieParser());

//data sanitization
app.use(mongoSanitize()); //for nosql injection
app.use(xss()); // for xss
// app.use(hpp()); //for param pollution

//static file serving
app.use(express.static("./public"));

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
