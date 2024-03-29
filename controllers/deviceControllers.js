const urlHelper = require("./helpers/urlHelper");
const hubRequest = require("./helpers/hubRequest");
const Device = require("../models/deviceModel");
const Config = require("./../models/configModel");
const User = require("./../models/userModel");
const fetch = require("node-fetch");
const catchAsync = require("./helpers/catchAsync");
const AppError = require("./../utils/error");

//
//----------------
//
// const manualQuery = async function(){
//    return await
// }()
exports.getDevices = catchAsync(async (req, res, next) => {
  //queryParams first
  if (req.query.favourite) {
    if (req.query.favourite == "true") {
      const devices = await Device.find({ configID: req.params.id, favourite: true });
      return res.status(200).json({ status: "success", data: devices });
    }
    if (req.query.favourite == "false") {
      const devices = await Device.find({ configID: req.params.id });
      return res.status(200).json({ status: "success", data: devices });
    }
  }

  //Get the associated config
  const assocConfig = await Config.find({ _id: req.params.id});
  if (!assocConfig) return next(new AppError("This config does not exist", 400));
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
  if (!hubResponse) return next(new AppError("An error occurred", 400));
  //create a doc to upload to db for each device
  hubResponse.forEach(async (item, i) => {
    const device = {
      configID: req.params.id,
      deviceID: item.id,
      user: req.user.id,
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
            }).catch(err=>console.log(err))

            //if the hub responds with a different status, update the db with it.
          if (existingData.status !== device.status || existingData.label !== device.label) {
            //update many - this will update devices that are in any config. Match user & name too to ensure only their correct devices are updated
            await Device.updateMany(
              { user: req.user.id, deviceID: device.deviceID, name: device.name},
              { status: device.status, label: device.label }
            )
          }
          resData.push(existingData);
        }
        if (result === false) {
          const createdDevice = await Device.create(device)
            .then((res) => res.json()).catch(err=>console.log(err))
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
  const storedDevices = await Device.find({ configID: req.params.id, user: req.user.id });
  storedDevices.forEach((device) => resData.push(device));
  return res.status(200).json({ status: "success", data: resData });
});

// })
//
//-------------
//

exports.updateDevice = catchAsync(async function (req, res, next) {
  //check which properties are being updated and update them.
  if (req.body.hasOwnProperty("newState")) {
    Device.findOneAndUpdate(
      { configID: req.body.configID, deviceID: req.body.deviceID },
      { favourite: req.body.newState }
    );
    return res.status(200).json({ status: "success", data: req.body });
  }
  if (req.body.hasOwnProperty("excluded")) {
    Device.findOneAndUpdate(
      { configID: req.body.configID, deviceID: req.body.deviceID },
      { excluded: req.body.excluded }
    );
    return res.status(200).json({ status: "success", data: req.body });
  }
});

//
//--------------
//

exports.getSingleDevice = catchAsync(async function (req, res, next) {
  const device = await Device.findOneAndUpdate({
    configID: req.params.configID,
    deviceID: req.params.deviceID,
  });
  if (!device) {
    return new AppError("Device not found", 404);
  }
  return res.status(200).json({ status: "success", data: device });
});

//
//--------------------
//

exports.changeDeviceState = catchAsync(async function (req, res, next) {
  const assocDevice = await Device.find({ configID: req.params.configID, deviceID: req.params.deviceID }).then(
    (data) => {
      return data;
    }
  );

  const assocConfig = await Config.find({ _id: req.params.configID });
  //build url to make request | prettier-ignore
  const stateChangeUrl = urlHelper.buildURL(
    assocConfig[0].type,
    assocConfig[0].target,
    assocConfig[0].appID,
    assocConfig[0].APIKey,
    req.params.deviceID,
    `/${req.params.status}`
  );
  // //make request - this does not return the new state
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
    { status: newStatus.currentValue, $inc: { interactions: 1 } } // increment interactions by 1
  );

  return res.status(200).json({ status: "success", data: newStatusFromHub });
});

//
//------------------
//

exports.deleteDevice = function (req, res, next) {
  res.send("x");

  return console.log("z");
};
