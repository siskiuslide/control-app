const mongoose = require("mongoose");
const deviceSchema = new mongoose.Schema(
  {
    configID: { type: String, required: true },
    deviceID: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    label: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
    commands: { type: Array, required: false },
  },
  { timestamps: true }
);
const Device = mongoose.model("devices", deviceSchema);

module.exports = Device;
