const express = require("express");
const deviceControllers = require("./../controllers/deviceControllers");
const router = express.Router();

router
  .route("/:configID")
  .get(deviceControllers.getSingleDevice)
  .delete(deviceControllers.deleteDevice)
  .patch(deviceControllers.updateDevice);

router.route("/:configID/:deviceID").get(deviceControllers.getSingleDevice);

router.route("/:configID/:deviceID/:status").get(deviceControllers.changeDeviceState);


module.exports = router;
