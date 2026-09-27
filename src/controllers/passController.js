const Pass = require("../models/pass");
const Visit = require("../models/visit");
const QRCode = require("qrcode");
const crypto = require("crypto");

const createPass = async (req, res) => {
  try {
    const { organizationId, visitId, visitorId, validFrom, validUntil } =
      req.body;

    const visit = await Visit.findById(visitId);

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Visit not found",
      });
    }

    if (visit.status !== "APPROVED") {
      return res.status(400).json({
        success: false,
        message: "Pass can only be generated for an approved visit",
      });
    }

    const existingPass = await Pass.findOne({ visitId });

    if (existingPass) {
      return res.status(400).json({
        success: false,
        message: "Pass already exists for this visit",
      });
    }

    const passCode = `SP-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;

    const qrData = JSON.stringify({
      passCode,
      visitId,
      visitorId,
    });

    const qrCodeImage = await QRCode.toDataURL(qrData);

    const pass = await Pass.create({
      organizationId,
      visitId,
      visitorId,
      passCode,
      qrData,
      validFrom,
      validUntil,
    });

    res.status(201).json({
      success: true,
      message: "Pass generated successfully",
      pass,
      qrCodeImage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate pass",
      error: error.message,
    });
  }
};

module.exports = {
  createPass,
};
