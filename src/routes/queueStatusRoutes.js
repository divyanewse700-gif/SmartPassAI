const express = require("express");

const router = express.Router();

const { updateQueueStatus } = require("../controllers/queueStatusController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.patch(
  "/:queueId/status",
  authMiddleware,
  roleMiddleware("ADMIN", "STAFF"),
  updateQueueStatus,
);

module.exports = router;
