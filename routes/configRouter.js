const express = require("express");
const configController = require("./../controllers/configControllers");
const deviceController = require("./../controllers/deviceControllers");
const authController = require("./../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protectRoute, configController.getConfig)
  .post(authController.protectRoute, configController.createConfig)
  .patch(authController.protectRoute, configController.updateConfig)
  .delete(authController.protectRoute, authController.restrictTo("admin", "dev"), configController.deleteConfig);

router.route("/:id").get(configController.getSingleConfig);
module.exports = router;

router.route("/:id/devices").get(deviceController.getDevices);
