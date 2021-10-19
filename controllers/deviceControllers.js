const urlHelper = require("./helpers/urlHelper");
const Device = require("../models/deviceModel");
const Config = require("./../models/configModel");
const fetch = require("node-fetch");

exports.getDevices = async (req, res) => {
  try {
    const assocConfig = await Config.find({ _id: req.params.id });

    const url = urlHelper.buildURL(
      assocConfig[0].type,
      assocConfig[0].target,
      assocConfig[0].appID,
      assocConfig[0].APIKey,
      "devices"
    );
    const hubResponse = await fetch(url, { method: "GET" })
      .then((res) => res.json())
      .catch((err) => console.log(err));

    const hubDevices = [];
    const resData = [];

    //Create a document for each device
    hubResponse.forEach(async (item, i) => {
      const device = {
        configID: req.params.id,
        deviceID: item.id,
        name: item.name,
        label: item.label,
        type: item.type,
        status: item.attributes.switch,
        commands: item.commands,
      };

      //check whether the doc already exists, if not, add it
      Device.exists({ configID: device.configID, deviceID: device.deviceID }, async function (err, result) {
        if (result === false) {
          await Device.create(device).catch((err) => console.log(err));
        }
        if (err) {
          console.log(err);
        }
      });

      hubDevices.push(device);
    });
    const storedDevices = await Device.find({});
    storedDevices.forEach((device) => resData.push(device));
    return res.status(200).json({ status: "Success", data: resData });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ status: "failed", message: err });
  }
};

exports.updateDevice = function (req, res) {
  try {
    Device.findOneAndUpdate(
      { configID: req.body.configID, deviceID: req.body.deviceID },
      { favourite: req.body.favourite }
    )
      .then((res) => console.log(res))
      .catch((err) => {
        console.log(err);
      });
    return res.status(200).json({ status: "Success", data: req.body });
  } catch (err) {
    return res.status(404).json({ status: "failed", message: err });
  }
};

exports.getSingleDevice = function (req, res) {
  return res.status(200).json({ status: "Success", data: { id: `${req.params.id}`, name: `Lightbulb`, status: "on" } });
};

exports.deleteDevice = function (req, res) {
  res.send("x");
  return console.log("z");
};
