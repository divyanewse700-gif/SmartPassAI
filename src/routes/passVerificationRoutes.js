const express = require("express");

const router = express.Router();

const { verifyPass } = require("../controllers/passVerificationController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "SECURITY"),
  verifyPass,
);

module.exports = router;
