const Config = require("./../models/configModel");
const Device = require("./../models/deviceModel");
const DeviceControllers = require("./deviceControllers");

exports.getConfig = async function (req, res) {
  try {
    if(req.query.favourite){
      const data = await Config.find({favourite: req.query.favourite})
      console.log(data)
      return res.status(200).json({status: 'success', body: data})
    }
    const configs = await Config.find();
    return res.status(200).json({ status: "success", body: configs });
  } catch (err) {
    return res.status(400).json({ status: "failed", message: err });
  }
};
exports.getSingleConfig = async function (req, res) {
  try {
    await Config.find({ _id: req.params.id }).then((data) => {
      res.status(200).json({ status: "success", data: data });
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: "failed", message: err });
  }
};

exports.createConfig = async function (req, res) {
  try {
    Config.exists({ name: req.body.name }, function (err, result) {
      if (result == true) {
        return res.status(400).json({ status: "failed", message: "bad request" });
      }
      if (err) {
        console.log(err);
      }
    });
    await Config.create(req.body).then((data) => {
      res.status(200).json({ status: "success", data: req.body });
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: "failed", message: err });
  }
};
exports.updateConfig = async function (req, res) {
  try {
    const object = req.body;
    await Config.findByIdAndUpdate(`${object._id}`, object);
    res.status(200).json({ status: "success", data: object });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ status: "Failure", message: err });
  }
};

exports.deleteConfig = async function (req, res) {
  try {
    console.log(req.body);
    await Config.deleteOne({ _id: req.body.id }).catch((err) => console.log(err));
    await Device.deleteMany({ configID: req.body.id }).catch((err) => console.log(err));
    return res.status(200).json({ status: "Success", message: { text: "Deleted config from database" } });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ status: "failed", message: err });
  }
};
