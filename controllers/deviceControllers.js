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

    const devices = [];
    let resData = [];
  
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
      Device.exists({ configID: device.configID, deviceID: device.deviceID }, async function (err, result) {
        if (result === false) {
          await Device.create(device)
            .then((data) => console.log(data))
            .catch((err) => console.log(err));
        }
        if (err) {
          console.log(err);
        }
      });

      devices.push(device);
    });

    return res.status(200).json({ status: "Success", data: devices });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ status: "failed", message: err });
  }
};

exports.getDevice = function (req, res) {
  return res.status(200).json({ status: "Success", data: { id: `${req.params.id}`, name: `Lightbulb`, status: "on" } });
};

exports.deleteDevice = function (req, res) {
  res.send("x");
  return console.log("z");
};
