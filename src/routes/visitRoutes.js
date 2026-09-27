const express = require("express");

const router = express.Router();

const { createVisit,getVisits} = require("../controllers/visitController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "STAFF", "HOST"),
  createVisit
);

router.get(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN", "STAFF", "HOST"),
    getVisits
);

module.exports = router;
