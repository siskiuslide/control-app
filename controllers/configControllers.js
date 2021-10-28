const Config = require("./../models/configModel");
const Device = require("./../models/deviceModel");
const DeviceControllers = require("./deviceControllers");
const APITools = require("../utils/APITools");
const catchAsync = require("./helpers/catchAsync");

//
//----------------
//

exports.getConfig = catchAsync(async function (req, res, next) {
  if (req.query.favourite) {
    const data = await Config.find({ favourite: req.query.favourite });
    console.log(data);
    return res.status(200).json({ status: "success", body: data });
  }
  const configs = await Config.find();
  return res.status(200).json({ status: "success", body: configs });
});

//
//------------------
//

exports.getSingleConfig = catchAsync(async function (req, res, next) {
  await Config.find({ _id: req.params.id }).then((data) => {
    res.status(200).json({ status: "success", data: data });
  });
});

//
//------------------
//
exports.createConfig = catchAsync(async function (req, res, next) {
  Config.exists({ name: req.body.name }, function (err, result) {
    if (result == true) {
      return res.status(400).json({ status: "failed", message: "bad request" });
    }
    if (err) {
      console.log(err);
    }
  });
  console.log(req.body);
  await Config.create(req.body).then((data) => {
    res.status(200).json({ status: "success", data: req.body });
  });
});

//
//--------------
//

exports.updateConfig = catchAsync(async function (req, res, next) {
  const object = req.body;
  await Config.findByIdAndUpdate(`${object._id}`, object);
  res.status(200).json({ status: "success", data: object });
});

//
//-------------
//

exports.deleteConfig = catchAsync(async function (req, res, next) {
  console.log(req.body);
  await Config.deleteOne({ _id: req.body.id }).catch((err) => console.log(err));
  await Device.deleteMany({ configID: req.body.id }).catch((err) => console.log(err));
  return res.status(200).json({ status: "Success", message: { text: "Deleted config from database" } });
});
