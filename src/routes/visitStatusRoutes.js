const express = require("express");

const router = express.Router();

const { updateVisitStatus } = require("../controllers/visitStatusController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.patch(
  "/:visitId/status",
  authMiddleware,
  roleMiddleware("ADMIN", "STAFF", "HOST"),
  updateVisitStatus,
);

module.exports = router;
