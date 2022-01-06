const User = require("./../models/userModel");
const catchAsync = require("./helpers/catchAsync");
const APITools = require("../utils/APITools");
const AppError = require("./../utils/error");

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
