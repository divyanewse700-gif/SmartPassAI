const express = require("express");

const router = express.Router();

const {
  getDashboardSummary,
  getVisitorStats,
  getVisitPurposeStats,
  getPeakHours,
} = require("../controllers/dashboardController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
  "/summary",
  authMiddleware,
  roleMiddleware("ADMIN", "STAFF"),
  getDashboardSummary,
);

router.get(
  "/visitor-stats",
  authMiddleware,
  roleMiddleware("ADMIN", "STAFF"),
  getVisitorStats,
);

router.get(
  "/visit-purpose-stats",
  authMiddleware,
  roleMiddleware("ADMIN", "STAFF"),
  getVisitPurposeStats,
);

router.get(
  "/peak-hours",
  authMiddleware,
  roleMiddleware("ADMIN", "STAFF"),
  getPeakHours,
);

module.exports = router;
