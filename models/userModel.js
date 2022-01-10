const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email address"],
  },
  role: {
    type: String,
    enum: ["dev", "admin", "user"],
    default: "user",
    required: true,
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm password"],
    validate: {
      //this only validates on CREATE / SAVE (NOT findOneAndUpdate)
      validator: function (el) {
        return el === this.password; // returns t/f for valid/invalid
      },
      message: "Passwords do not match",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLoggedIn: {
    type: Date,
    default: "never",
  },
});
///////////////////////
//DOCUMENT MIDDLEWARE//
///////////////////////
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12); // hash the password with a cost of 12
  this.passwordConfirm = undefined; //password confirm is only used to validate. We don't really need to store it.
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000; //remove some time from date - save() to db takes longer than issuing token.
  return next();
});

////////////////////////
//INSTANCE METHODS/////
///////////////////////
// Return T/F.
userSchema.methods.comparePassword = async function (candidatePassword, password) {
  return await bcrypt.compare(candidatePassword, password);
};

userSchema.methods.changedPasswordAfterJWT = async function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10); //convert date string into timestamp & parse as a number.
    // const changedTimeStamp = this.passwordChangedAt.getTime(); //code for if stored as timestamp (testing purposes)
    return jwtTimestamp < changedTimeStamp;
  }
  return false; //default return value
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.passwordResetExpires = Date.now() + 60 * 60 * 1000;
  console.log({ resetToken }, this.passwordResetToken);
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
