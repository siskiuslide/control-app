const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: 8,
    maxlength: 16,
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
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12); // hash the password with a cost of 12
  this.passwordConfirm = undefined; //password confirm is only used to validate. We don't really need to store it.
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
