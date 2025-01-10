const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController.js");
const verifyJWT = require("../middleware/verifyJWT.js");

// Route for creating a new user does not require JWT verification
router.post("/", usersController.createNewUser);

// Apply JWT verification to all other routes
router.use(verifyJWT);

router
  .route("/")
  .get(usersController.getAllUsers)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = router;
