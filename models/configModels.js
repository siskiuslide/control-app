const mongoose = require("mongoose");

const configSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String },
  target: { type: String, required: true, unique: true },
  APIKey: { type: String, required: true, unique: true },
  appID: { type: Number, required: true },
  lastUpdated: {type: Date, default: Date.now(), required: true},
  favourite: {type: Boolean, default: false}
});

const Config = mongoose.model("configs", configSchema);


module.exports = Config
