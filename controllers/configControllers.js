const Config = require("./../models/configModel");
const Device = require("./../models/deviceModel");
const DeviceControllers = require("./deviceControllers");
const APITools = require("../utils/APITools");
const catchAsync = require("./helpers/catchAsync");

//
//----------------
//

exports.getConfig = catchAsync(async function (req, res, next) {
  console.log(req.url);
  console.log(req.query);
  //query requests first
  if (req.query.favourite) {
    let favConfigs;
    if (req.query.favourite == "true") {
      favConfigs = await Config.find({user: req.user.id, favourite: true }).catch((err) => console.log(err));
      console.log(favConfigs);
      return res.status(200).json({ status: "Success", data: favConfigs });
    }
    if (req.query.favourite == "false") {
      favConfigs = await Config.find({user: req.user.id}).catch((err) => console.log(err));
      return res.status(200).json({ status: "Success", data: favConfigs });
    }
  }
  const configs = await Config.find({user: req.user.id});
  return res.status(200).json({ status: "success", body: configs });
});

//
//------------------
//

exports.getSingleConfig = catchAsync(async function (req, res, next) {
  const config = await Config.find({user: req.user.id,  _id: req.params.id })
  res.status(200).json({ status: "success", data: config });
  });


//
//------------------
//
exports.createConfig = catchAsync(async function (req, res, next) {
  Config.exists({user: req.user.id, name: req.body.name }, function (err, result) {
    if (result == true) {
      return res.status(400).json({ status: "failed", message:"Config already exists! Cannot create duplicate configs" });
    }
    if (err) {
      console.log(err);
    }
  });
  const config = await Config.create(req.body)
  res.status(200).json({ status: "success", data: config });
  });

  //
//--------------
//
//prettier-ignore
exports.updateConfig = catchAsync(async function (req, res, next) {
  if (req.body.hasOwnProperty("newState")) {
    Config.findOneAndUpdate(
      { _id: req.body.configID },
      { favourite: req.body.newState }
      )
      .catch((err) => {
      console.log(err);
    });
    return res.status(200).json({ status: "success", data: req.body });
  }
});

//
//-------------
//

exports.deleteConfig = catchAsync(async function (req, res, next) {
  await Config.deleteOne({ _id: req.body.id }).catch((err) => console.log(err));
  await Device.deleteMany({ configID: req.body.id }).catch((err) => console.log(err));
  return res.status(200).json({ status: "Success", message: { text: "Deleted config from database" } });
});
