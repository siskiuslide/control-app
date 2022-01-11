const { promisify } = require("util");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./helpers/catchAsync");
const AppError = require("./../utils/error");
const sendEmail = require("./../utils/emailer");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
};

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRATION * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    cookie.options.secure = true;
  }
  res.cookie("jwt", token, cookieOptions);
  user.password = undefined; //remove it from response
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  //create jwt token for new user and send it back straight away
  createAndSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //check if credentials exist
  if (!email || !password) {
    return next(new AppError("Please provide an email and password", 400));
  }
  //check if user exists & if credentials match
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  await User.findByIdAndUpdate(user.id, { lastLoggedIn: Date.now() });
  //send token back if ^ = true
  createAndSendToken(user, 200, res);
});

exports.protectRoute = catchAsync(async (req, res, next) => {
  let token;
  //get token from user
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer") ) {
    token = req.headers.authorization.split(" ")[1];
  }else if (req.cookies.jwt){
    token = req.cookies.jwt
  }
  if (!token) {
    // return res.redirect(`http://127.0.0.1:5500/portal.html`)
    // return res.redirect(`${req.protocol}://${req.host}/portal.html`)
    return next(new AppError("Please login to access", 401));
  }

  //verify token payload.
  const decodedPayload = await promisify(jwt.verify)(token, process.env.JWT_SECRET); //promisify allows you to await functions that usually take a callback function

  //check if user still exists
  const user = await User.findById(decodedPayload.id);
  if (!user) return next(new AppError("User no longer exists", 401));

  //check if password !changed after jwt was signed
  if (await user.changedPasswordAfterJWT(decodedPayload.iat)) {
    return next(new AppError("Password has changed recently. Please login again", 401));
  }

  //grant access and assign the user to the request
  req.user = user;
  next();
});

//roles is an array of authorized users
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You don't have permission to do this"), 403);
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // get user based on their email address
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError("There is no user with that email address", 404));

  //generate random token using schema method
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false }); //remove validators on the schema when saving document at this stage

  //send it back to the email address
  const resetURL = `${req.protocol}://${req.get("host")}/users/resetPassword/${resetToken}`;
  const message = `Forgot your password?\n\nSubmit a new password using ${resetURL}\nThis link will expire in 1 hour.\nIf you didn't request a reset, please ignore this email.`;
  try {
    await sendEmail({
      email: user.email,
      subject: `Reset Password token`,
      message,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetToken = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError("There was an error sending reset token. Please try again later", 500));
  }

  res.status(200).json({ status: "success", message: "Token sent to user email inbox" });
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  //hash token from URL and compare, then find user who has a valid token in the db
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError("Token is invalid or has expired", 400));
  //set new password & update values in db
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save({ validateBeforeSave: true }); //validates (password === passwordConfirm)
  //update changedPasswordAt property in document middleware in userModel.js
  //log user in with new signed token
  createAndSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //expect 3 items in req.body.
  //req.body.passwordCurrent === the current password before changing
  //req.body.password === new password
  //req.body.password === confirms new password

  //get user
  const user = await User.findById(req.user._id).select("+password"); //password not included by default
  if (!user) return next(new AppError("User not found", 400));
  //check posted (current) password is equal to the one user entered
  if (!(await user.comparePassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is incorrect", 401));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save({ validateBeforeSave: true });
  //log user in, send JWT
  createAndSendToken(user, 200, res);
});
