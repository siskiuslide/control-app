const mongoose = require("mongoose");
const deviceSchema = new mongoose.Schema(
  {
    configID: { type: String, required: true },
    deviceID: { type: String, required: true },
    name: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
    commands: { type: Array, required: false },
    favourite: { type: Boolean, default: false },
    date: { type: Date, required: false },
  },
  { timestamps: true }
);

// deviceSchema.pre("save", function (next) {
//   if (this.type.includes("Switch") || this.type.includes("Plug")) {
//     this.imageAddress = `Switch ${this.status}.png`;
//   }
//   if (this.type.includes("Bulb") || this.type.includes("Strip") || this.type.includes("RGB")) {
//     this.imageAddress = `Lightbulb ${this.status}.png`;
//   }
//   next();
// });
const Device = mongoose.model("devices", deviceSchema);

module.exports = Device;
