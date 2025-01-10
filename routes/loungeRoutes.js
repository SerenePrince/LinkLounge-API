const express = require("express");
const router = express.Router();
const loungesController = require("../controllers/loungesController.js");
const verifyJWT = require("../middleware/verifyJWT.js");
const upload = require("../config/multer.js");

// Public Route: Fetch Public Lounge
router.get("/:username/:title", loungesController.getPublicLounge);
router.get("/:user", loungesController.getLoungesByUser);

// Authenticated Routes
router.use(verifyJWT);

router.post(
  "/",
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "background", maxCount: 1 },
  ]),
  loungesController.createNewLounge
);
router.patch(
  "/",
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "background", maxCount: 1 },
  ]),
  loungesController.updateLounge
);

router
  .route("/")
  .get(loungesController.getAllLounges)
  .patch(loungesController.updateLounge)
  .delete(loungesController.deleteLounge);

router.patch("/public", loungesController.makeLoungePublic);

module.exports = router;
