const express = require("express");

const router = express.Router();

const { createPass } = require("../controllers/passController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/", authMiddleware, roleMiddleware("ADMIN", "STAFF"), createPass);

module.exports = router;
