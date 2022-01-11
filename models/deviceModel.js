const mongoose = require("mongoose");
const deviceSchema = new mongoose.Schema(
  {
    configID: { type: String, required: true },
    deviceID: { type: String, required: true },
    user: { type: String, required: true },
    name: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
    commands: { type: Array, required: false },
    favourite: { type: Boolean, default: false },
    excluded: { type: Boolean, default: false },
    date: { type: Date, required: false },
  },
  { timestamps: true }
);

const Device = mongoose.model("devices", deviceSchema);

module.exports = Device;
