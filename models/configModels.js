const mongoose = require("mongoose");

const configSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, required: true, unique: true },
  target: { type: String, required: true, unique: true },
  APIKey: { type: String, required: true, unique: true },
  appID: { type: Number, required: true },
});

const Config = mongoose.model("configs", configSchema);

exports.confChecker = async function (object) {
  await Device.exists({ name: object.name }, function (err, result) {
    if (err) {
      return console.log(err);
    }
    result == true ? updateDocument(object) : createDocument(object);
  });
};

exports.updateDocument = async function (object) {
  try {
    await Config.findOneAndUpdate({ name: object.name }, object).then((res) => {
      console.log(`updated config ${object.name}`);
    });
  } catch (err) {
    console.log(err);
    console.log("unable to update that document");
  }
};
exports.createDocument = async function (object) {
  try {
    await Config.create(object).then((res) => {
      console.log(`created object with name ${object.name}`);
    });
  } catch (err) {
    console.log(err);
    console.log("unable to create document");
  }
};
