const express = require("express");

const router = express.Router();

const {
  checkInVisitor,
  getActiveCheckIns,
} = require("../controllers/checkInController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
  "/active",
  authMiddleware,
  roleMiddleware("ADMIN", "SECURITY"),
  getActiveCheckIns,
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "SECURITY"),
  checkInVisitor,
);

module.exports = router;
