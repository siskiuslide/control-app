const express = require("express");
const deviceControllers = require("./../controllers/deviceControllers");
const authController = require("./../controllers/authController");

const router = express.Router();

router
  .route("/:configID")
  .get(authController.protectRoute, deviceControllers.getSingleDevice)
  .delete(authController.protectRoute, deviceControllers.deleteDevice)
  .patch(authController.protectRoute, deviceControllers.updateDevice);

router.route("/:configID/:deviceID").get(authController.protectRoute, deviceControllers.getSingleDevice);

router.route("/:configID/:deviceID/:status").get(authController.protectRoute, deviceControllers.changeDeviceState);

module.exports = router;
