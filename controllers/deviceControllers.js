const urlHelper = require("./helpers/urlHelper");
const hubRequest = require("./helpers/hubRequest");
const Device = require("../models/deviceModel");
const Config = require("./../models/configModel");
const fetch = require("node-fetch");

exports.getDevices = async (req, res) => {
  try {
    //Get the associated config
    const assocConfig = await Config.find({ _id: req.params.id });
    //build the url for that config | prettier-ignore
    const url = urlHelper.buildURL(
      assocConfig[0].type,
      assocConfig[0].target,
      assocConfig[0].appID,
      assocConfig[0].APIKey,
      "devices"
    );
    //make request
    const hubResponse = await hubRequest(url);
    //Array to push db results to
    const resData = [];

    //Create a document for each device
    hubResponse.forEach(async (item, i) => {
      //create a doc to upload to db
      const device = {
        configID: req.params.id,
        deviceID: item.id,
        name: item.name,
        label: item.label,
        type: item.type,
        status: item.attributes.switch,
        commands: item.commands,
        date: item.date,
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
    });
    //get data from db and send
    const storedDevices = await Device.find({});
    storedDevices.forEach((device) => resData.push(device));
    return res.status(200).json({ status: "Success", data: resData });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ status: "failed", message: err });
  }
};

exports.updateDevice = async function (req, res) {
  try {
    //check which properties are being updated and update them.
    if (req.body.hasOwnProperty("favourite")) {
      console.log(req.body);
      Device.findOneAndUpdate(
        { configID: req.body.configID, deviceID: req.body.deviceID },
        { favourite: req.body.favourite }
      ).catch((err) => {
        console.log(err);
      });
    }
    return res.status(200).json({ status: "Success", data: req.body });
  } catch (err) {
    return res.status(404).json({ status: "failed", message: err });
  }
};

exports.getSingleDevice = async function (req, res) {
  const device = await Device.findOneAndUpdate({ configID: req.params.configID, deviceID: req.params.deviceID }).catch(
    (err) => console.log(err)
  );
  console.log(device);
  return res.status(200).json({ status: "Success", data: device });
};

exports.deleteDevice = function (req, res) {
  res.send("x");
  return console.log("z");
};
