const User = require("./../models/userModel");
const Device = require("./../models/deviceModel");
const Config = require("./../models/configModel");
const catchAsync = require("./helpers/catchAsync");
const APITools = require("../utils/APITools");
const AppError = require("./../utils/error");

const filterObject = function (object, ...allowedFields) {
  const filtered = {};
  Object.keys(object).forEach((key) => {
    if (allowedFields.includes(key)) {
      filtered[key] = object[key];
    }
  });
  return filtered;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({ status: "Success", data: users });
});
exports.getSingleUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.body.id);
  res.status(200).json({ status: "Success", data: user });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(200).json({ status: "Success", data: user });
});
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findOneAndDelete({ _id: req.params.id });
  res.status(200).json({ status: "Success", data: user });
});
exports.updateUser = catchAsync(async (req, res, next) => {
  const updateObject = req.body;
  const user = await User.findOneAndUpdate({ _id: req.params.id }, { updateObject });
  res.status(200).json({ status: "Success", data: user });
});

//for currently authenticated user
exports.getMe = catchAsync(async (req, res, next) => {
  //update counts to send to dashboard first
  const devices = await Device.find({ user: req.user.id });
  const uniqueDevices = await Device.find({ user: req.user.id }).distinct("deviceID");
  const configs = await Config.find({ user: req.user.id });
  const totalInteractions = await Device.aggregate([
    {$match: {user: req.user.id}},
    {$group: {_id:'', interactions: {$sum: '$interactions'}}},
    {$project: {
      _id: 0,
      interactions: '$interactions'
    }}
  ]
  )
 

  const user = await User.findByIdAndUpdate(req.user.id, {
    deviceCount: devices.length,
    configCount: configs.length,
    uniqueDeviceCount: uniqueDevices.length,
    interactions: totalInteractions[0].interactions
  });

  return res.status(200).json({ status: "success", data: user });
});
exports.updateMe = catchAsync(async (req, res, next) => {
  //if body contains password create an error
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("Cannot update password from this route", 400));
  }

  //filter fields that cannot be updated
  const updateObject = filterObject(req.body, "name", "email");

  //update document
  const user = await User.findByIdAndUpdate(req.user.id, updateObject, { new: true, runValidators: true }); //we can use update rather than save here because we don't need the password validator to run

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({ status: "Success", data: null });
});
