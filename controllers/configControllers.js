const Config = require("./../models/configModel");
const DeviceControllers = require("./deviceControllers");

exports.getConfig = async function (req, res) {
  try {
    const configs = await Config.find();
    res.status(200).json({ status: "success", body: configs });
  } catch (err) {
    res.status(400).json({ status: "failed", message: err });
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
    res.status(404).json({ status: "Failure", message: err });
  }
};

exports.deleteConfig = async function (req, res) {
  try {
    console.log(req.body);
    await Config.deleteOne({ _id: req.body.id }).then((response) => {
      return res.status(200).json({ status: "Success", message: { text: "Deleted config from database" } });
    });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ status: "failed", message: err });
  }
};

////EMBEDDED DEVICES

exports.insertDevices = async (req, res) => {
  try {
    const data = await DeviceControllers.getAllDevices(req.params);
    const devices = [];
    data.forEach((item) => {
      const document = {
        configID: req.params.id,
        deviceID: item.id,
        name: item.name,
        label: item.label,
        type: item.type,
        status: item.attributes.switch,
        commands: item.commands,
      };
      devices.push(document);
      Config.update({ _id: req.params.id }, { $push: { devices: document } });
    });

    return res.status(200).json({ status: "Success", data: devices });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ status: "failed", message: err });
  }
};
