const express = require("express");

const router = express.Router();

const { createOrganization } = require("../controllers/organizationController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/", authMiddleware, roleMiddleware("ADMIN"), createOrganization);

module.exports = router;
