const express = require("express");

const router = express.Router();

const {
  createQueueEntry,
  getQueues,
} = require("../controllers/queueController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "STAFF"),
  createQueueEntry,
);

router.get("/", authMiddleware, roleMiddleware("ADMIN", "STAFF"), getQueues);

module.exports = router;
