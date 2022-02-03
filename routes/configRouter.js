const express = require("express");
const configController = require("./../controllers/configControllers");
const deviceController = require("./../controllers/deviceControllers");
const authController = require("./../controllers/authController");

const router = express.Router();


//add authcontroller.protectroute to all of these 
router
  .route("/")
  .get(configController.getConfigNoneAuth)
  .post(configController.createConfig)
  .patch(configController.updateConfig)
  .delete(configController.deleteConfig);

router.route("/:id").get(configController.getSingleConfig);
module.exports = router;

router.route("/:id/devices").get(deviceController.getDevices);
