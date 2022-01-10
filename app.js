const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/error");
const globalErrorHandler = require("./controllers/errorController");
const authController = require('./controllers/authController')
const app = express();

app.use(express.json());
app.use(express.static("./public"));
app.use(morgan("dev"));
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
