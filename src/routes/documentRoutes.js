const express = require("express");
const multer = require("multer");

const { analyzeDocument } = require("../controllers/documentController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG and PNG images are allowed"));
    }
  },
});

router.post(
  "/analyze",
  authMiddleware,
  roleMiddleware("ADMIN", "STAFF", "HOST"),
  upload.single("document"),
  analyzeDocument,
);

module.exports = router;
