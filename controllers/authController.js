const User = require("./../models/userModel");
const catchAsync = require("./helpers/catchAsync");

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = User.create(req.body);
  res.status(201).json({
    status: "Success",
    data: {
      user: newUser,
    },
  });
});
