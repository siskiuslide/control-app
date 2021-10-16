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

Device = mongoose.model("devices", deviceSchema);
// module.exports = Device;s

exports.docChecker = async function (object) {
  await Device.exists({ deviceID: object.deviceID }, function (err, result) {
    if (err) {
      return console.log(err);
    }
    result == true ? updateDocument(object) : createDocument(object);
  });
};

const updateDocument = async function (object) {
  try {
    await Device.findOneAndUpdate({ deviceID: object.deviceID }, object);
  } catch (err) {
    console.log(err);
  }
};

// exports.readCollection = function () {
//   // return DeviceModel.find();
//   try {
//     DeviceModel.find();
//   } catch (error) {
//     console.log(error);
//   }
// };
