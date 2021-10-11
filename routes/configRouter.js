const express = require("express");
const configController = require("./../controllers/configControllers");

const router = express.Router();

router
  .route("/")
  .get(configController.getConfig)
  .post(configController.createConfig)
  .patch(configController.updateConfig)
  .delete(configController.deleteConfig);

  router.route("/:id").get(configController.getSingleConfig)
module.exports = router;
