const urlHelper = require("./helpers/urlHelper");
const hubRequest = require("./helpers/hubRequest");
const Device = require("../models/deviceModel");
const Config = require("./../models/configModel");
const fetch = require("node-fetch");
const catchAsync = require("./helpers/catchAsync");
const AppError = require("./../utils/error");

//
//----------------
//
exports.getDevices = catchAsync(async (req, res, next) => {
  //Get the associated config
  const assocConfig = await Config.find({ _id: req.params.id });
  //build the url for that config | prettier-ignore
  const url = urlHelper.buildURL(
    assocConfig[0].type,
    assocConfig[0].target,
    assocConfig[0].appID,
    assocConfig[0].APIKey,
    "all"
  );
  //Array to push db results to
  const resData = [];
  //make request
  const hubResponse = await hubRequest(url);
  //create a doc to upload to db for each device
  hubResponse.forEach(async (item, i) => {
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
    //prettier-ignore
    Device.exists({ configID: device.configID, deviceID: device.deviceID, name: device.name }, async function (err, result) {
        //check whether the doc already exists, if not, add it
        if (result === true) {
          //if it already exists compare the status to the hub response and update
          const existingData = await Device.find({ configID: device.configID, deviceID: device.deviceID })
            .then((res) => {
              return res[0];
            })
            .catch((err) => console.log(err));
          if (existingData.status !== device.status || existingData.label !== device.label) {
            Device.findOneAndUpdate(
              { configID: device.configID, deviceID: device.deviceID },
              { status: device.status, label: device.label }
            ).catch((err) => console.log(err));
          }
          resData.push(existingData);
        }
        if (result === false) {
          const createdDevice = await Device.create(device)
            .then((res) => res.json())
            .catch((err) => console.log(err));
          return resData.push(createdDevice);
        }
        if (err) {
          console.log(err);
          new AppError(400, err.message);
        }
      }
    );
  });
  //get data from db and send
  const storedDevices = await Device.find({ configID: req.params.id }).catch((err) => console.log(err));
  storedDevices.forEach((device) => resData.push(device));
  return res.status(200).json({ status: "Success", data: resData });
});

// })
//
//-------------
//

exports.updateDevice = catchAsync(async function (req, res, next) {
  //check which properties are being updated and update them.
  if (req.body.hasOwnProperty("favourite")) {
    Device.findOneAndUpdate(
      { configID: req.body.configID, deviceID: req.body.deviceID },
      { favourite: req.body.favourite }
    ).catch((err) => {
      console.log(err);
    });
  }
  if (req.body.hasOwnProperty("excluded")) {
    Device.findOneAndUpdate(
      { configID: req.body.configID, deviceID: req.body.deviceID },
      { excluded: req.body.excluded }
    ).catch((err) => console.log(err));
    return res.status(200).json({ status: "Success", data: req.body });
  }
});

//
//--------------
//

exports.getSingleDevice = catchAsync(async function (req, res, next) {
  const device = await Device.findOneAndUpdate({
    configID: req.params.configID,
    deviceID: req.params.deviceID,
  }).catch((err) => console.log(err));
  if (!device) {
    return new AppError("Device not found", 404);
  }
  return res.status(200).json({ status: "Success", data: device });
});

//
//--------------------
//

exports.changeDeviceState = catchAsync(async function (req, res, next) {
  const assocDevice = await Device.find({ configID: req.params.configID, deviceID: req.params.deviceID })
    .then((data) => {
      return data;
    })
    .catch((err) => console.log(err));

  const assocConfig = await Config.find({ _id: req.params.configID }).catch((err) => console.log(err));
  //build url to make request | prettier-ignore
  const stateChangeUrl = urlHelper.buildURL(
    assocConfig[0].type,
    assocConfig[0].target,
    assocConfig[0].appID,
    assocConfig[0].APIKey,
    req.params.deviceID,
    `/${req.params.status}`
  );
  //make request - this does not return the new state
  const hubResponse = await hubRequest(stateChangeUrl);
  //get new status from hub | prettier-ignore
  const newStatusUrl = urlHelper.buildURL(
    assocConfig[0].type,
    assocConfig[0].target,
    assocConfig[0].appID,
    assocConfig[0].APIKey,
    req.params.deviceID,
    ""
  );
  const newStatusFromHub = await hubRequest(newStatusUrl);
  //update db with new state
  const newStatus = newStatusFromHub.attributes.find((attr) => attr.name == "switch");
  const statusUpdateDB = await Device.findOneAndUpdate(
    { configID: req.params.configID, deviceID: req.params.deviceID },
    { status: newStatus.currentValue }
  ).catch((err) => console.log(err));

  return res.status(200).json({ status: "success", data: newStatusFromHub });
});

//
//------------------
//

exports.deleteDevice = function (req, res, next) {
  res.send("x");

  return console.log("z");
};
