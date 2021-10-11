const Config = require("./../models/configModels");
exports.getConfig = function (req, res) {};
exports.createConfig = async function (req, res) {
  try {
    Config.createDocument(req.body);
    res.status(200).json({
      status: "Success",
      message: `Config created - ${req.body.name}`,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "failed",
      message: "unable to create config",
    });
  }
};
exports.updateConfig = function (req, res) {
  return console.log("x");
};
exports.deleteConfig = function (req, res) {
  return console.log("x");
};
