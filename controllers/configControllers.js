exports.getConfig = function (req, res) {};
exports.createConfig = function (req, res) {
  console.log("posted form");
  return res.status(200).json({ status: "Success", message: req.body });
};
exports.updateConfig = function (req, res) {
  return console.log("x");
};
exports.deleteConfig = function (req, res) {
  return console.log("x");
};
