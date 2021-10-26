const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/error");
const globalErrorHandler = require("./controllers/errorController");
const app = express();

app.use(express.json());
app.use(express.static("./public"));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

const deviceRouter = require("./routes/deviceRouter");
const configRouter = require("./routes/configRouter");

app.use("/config", configRouter);

app.use("/devices", deviceRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server`, 400));
});
app.use(globalErrorHandler);

module.exports = app;
