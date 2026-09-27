const express = require("express");

const router = express.Router();

const { checkOutVisitor } = require("../controllers/checkOutController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.patch(
  "/:checkInId",
  authMiddleware,
  roleMiddleware("ADMIN", "SECURITY"),
  checkOutVisitor,
);

module.exports = router;
