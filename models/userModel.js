const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
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
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
