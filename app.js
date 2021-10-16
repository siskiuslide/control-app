const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());
app.use(express.static("./public"));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

const deviceRouter = require("./routes/deviceRouter");
const configRouter = require("./routes/configRouter");

//config page
app.use("/config", configRouter);
//devices per config
app.use("/config/:id/devices", deviceRouter);

module.exports = app;
