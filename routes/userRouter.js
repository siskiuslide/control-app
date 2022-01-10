const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);

//for users
router.route("/forgotPassword").post(authController.forgotPassword);
router.route("/resetPassword/:token").patch(authController.resetPassword);
router.patch("/updateMyPassword", authController.protectRoute, authController.updatePassword);
router.patch("/updateMe", authController.protectRoute, userController.updateMe);
router.delete("/deleteMe", authController.protectRoute, userController.deleteMe);

//accessible by admins/devs
router
  .route("/")
  .get(authController.protectRoute, authController.restrictTo("dev"), userController.getAllUsers)
  .post(authController.protectRoute, authController.restrictTo("admin", "dev"), userController.createUser);

router
  .route("/:id")
  .get(authController.protectRoute, authController.restrictTo("dev"), userController.getSingleUser)
  .patch(authController.protectRoute, authController.restrictTo("dev"), userController.updateUser)
  .delete(authController.protectRoute, authController.restrictTo("dev"), userController.deleteUser);

module.exports = router;
