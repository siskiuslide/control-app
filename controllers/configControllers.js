const Config = require("./../models/configModel");
const Device = require("./../models/deviceModel");
const User = require("./../models/userModel");
const APITools = require("../utils/APITools");
const catchAsync = require("./helpers/catchAsync");

//
//----------------
//

exports.getConfig = catchAsync(async function (req, res, next) {
  //query requests first
  if (req.query.favourite) {
    let favConfigs;
    if (req.query.favourite == "true") {
      favConfigs = await Config.find({ user: req.user.id, favourite: true });
      return res.status(200).json({ status: "Success", data: favConfigs });
    }
    if (req.query.favourite == "false") {
      favConfigs = await Config.find({ user: req.user.id });
      return res.status(200).json({ status: "Success", data: favConfigs });
    }
  }

  //if no query
  const configs = await Config.find({ user: req.user.id });

  // //update user configCount
  // const user = await User.findByIdAndUpdate(req.user.id, { configCount: configs.length() });
  //send configs back
  return res.status(200).json({ status: "success", body: configs });
});

//
//------------------
//

exports.getSingleConfig = catchAsync(async function (req, res, next) {
  const config = await Config.find({ user: req.user.id, _id: req.params.id });
  res.status(200).json({ status: "success", data: config });
});

//
//------------------
//
exports.createConfig = catchAsync(async function (req, res, next) {
  Config.exists({ user: req.user.id, name: req.body.name }, function (err, result) {
    if (result) {
      return res
        .status(400)
        .json({ status: "failed", message: "Config already exists! Cannot create duplicate configs" });
    }
    if (err) {
      console.log(err);
    }
  });
  const config = await Config.create({
    user: req.user.id,
    name: req.body.name,
    target: req.body.target,
    APIKey: req.body.APIKey,
    appID: req.body.appID,
  });
  res.status(200).json({ status: "success", data: config });
});

//
//--------------
//
//prettier-ignore
exports.updateConfig = catchAsync(async function (req, res, next) {
  if (req.body.hasOwnProperty("newState")) {
    await Config.findOneAndUpdate(
      { _id: req.body.configID },
      { favourite: req.body.newState }
      )
    return res.status(200).json({ status: "success", data: req.body });
  }
});

//
//-------------
//

exports.deleteConfig = catchAsync(async function (req, res, next) {
  await Config.deleteOne({ _id: req.body.id });
  await Device.deleteMany({ configID: req.body.id });
  return res.status(200).json({ status: "Success", message: { text: "Deleted config from database" } });
});
