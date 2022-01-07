const { promisify } = require("util");
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
  //check if credentials exist
  if (!email || !password) {
    return next(new AppError("Please provide an email and password", 400));
  }
  //check if user exists & if credentials match
  const user = await User.findOne({ email }).select("+password");
  console.log(user);

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  //send token back if ^ = true

  const token = signToken(user._id);
  res.status(200).json({
    status: "Success",
    token,
  });
});

exports.protectRoute = catchAsync(async (req, res, next) => {
  let token;
  //get token from user
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("Please login to access", 401));
  }

  //verify token payload.
  const decodedPayload = await promisify(jwt.verify)(token, process.env.JWT_SECRET); //promisify allows you to await functions that usually take a callback function

  //check if user still exists
  const user = await User.findById(decodedPayload.id);
  if (!user) return next(new AppError("User no longer exists", 401));

  //check if password !changed after jwt was signed
  if (user.changedPasswordAfterJWT(decodedPayload.iat))
    return next(new AppError("Password has changed recently. Please login again", 401));

  //grant access and assign the user to the request
  req.user = user;
  next();
});
