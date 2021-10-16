const urlHelper = require("./helpers/urlHelper");
const Device = require("../models/deviceModel");
const Config = require("./../models/configModel");
const fetch = require("node-fetch");

exports.getAllDevices = async function (params) {
  try {
    const assocConfig = await Config.find({ _id: params.id });
    console.log(assocConfig);

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

    return hubResponse;
  } catch (err) {
    console.log(err);
  }
};

exports.getDevice = function (req, res) {
  //called when a request comes from the frontend
  //use the req object to make fetch
  //make request to MONGO for device details and send it as a response
  return res.status(200).json({ status: "Success", data: { id: `${req.params.id}`, name: `Lightbulb`, status: "on" } });
};

exports.deleteDevice = function (req, res) {
  //remove from list of devices that appear in /devices/:id page or on the individual
  //will be added to a list of exclusions
  //then reload the /devices page
  res.send("x");
  return console.log("z");
};
