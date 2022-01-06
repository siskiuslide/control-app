const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./helpers/catchAsync");
const AppError = require("./../utils/error");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  //create jwt token for new user and send it back straight away
  const token = signToken(newUser._id);

  res.status(201).json({
    status: "Success",
    token: token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1. check if credentials exist
  if (!email || !password) {
    return next(new AppError("Please provide an email and password", 400));
  }
  //2. check if user exists & if credentials match
  const user = await User.findOne({ email }).select("+password");
  console.log(user)

  if (!user || ! await user.comparePassword(password, user.password)) {
    return next(new AppError("Incorrect email or password", 401));
  }
  //3. send token back if ^ = true

  const token = signToken(user._id);
  res.status(200).json({
    status: "Success",
    token,
  });
});
