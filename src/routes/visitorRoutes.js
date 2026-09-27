const express = require("express");

const router = express.Router();

const {
  createVisitor,
  registerVisitorFace,
} = require("../controllers/visitorController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "STAFF", "HOST"),
  createVisitor,
);

const multer = require("multer");

const upload = multer({
  dest: "uploads/faces/",
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
  "/register-face",
  authMiddleware,
  roleMiddleware("ADMIN", "STAFF", "HOST"),
  upload.single("face"),
  registerVisitorFace,
);

module.exports = router;
