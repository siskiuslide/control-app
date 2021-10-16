const express = require("express");
const deviceControllers = require("./../controllers/deviceControllers");
const router = express.Router();

router.route("/:id").get(deviceControllers.getDevice).delete(deviceControllers.deleteDevice);

module.exports = router;
