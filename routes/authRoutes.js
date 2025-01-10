const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const loginLimiter = require("../middleware/loginLimiter");

// Route to log in with username and password
router.route("/").post(loginLimiter, authController.login);

// Route to refresh access token using refresh token
router.route("/refresh").get(authController.refresh);

// Route to log out and clear refresh token cookie
router.route("/logout").post(authController.logout);

// Route to handle forgot password
router.route("/forgot-password").post(authController.forgotPassword);

// Route to handle reset password
router.route("/reset-password").post(authController.resetPassword);

// Route to handle forgot username
router.route("/forgot-username").post(authController.forgotUsername);

// Route to handle feedback
router.route("/feedback").post(authController.sendFeedback);

module.exports = router;
