const Pass = require("../models/pass");
const CheckIn = require("../models/checkIn");
const Visit = require("../models/visit");

const verifyPass = async (req, res) => {
  try {
    const { passCode } = req.body;

    if (!passCode) {
      return res.status(400).json({
        success: false,
        message: "Pass code is required",
      });
    }

    const pass = await Pass.findOne({ passCode });

    if (!pass) {
      return res.status(404).json({
        success: false,
        message: "Invalid pass",
      });
    }

    const visit = await Visit.findById(pass.visitId);

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Visit associated with this pass not found",
      });
    }

    if (pass.status === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "Pass has been cancelled",
      });
    }

    if (pass.status === "USED") {
      return res.status(400).json({
        success: false,
        message: "Pass has already been used",
      });
    }

    const currentTime = new Date();

    if (currentTime < pass.validFrom) {
      return res.status(400).json({
        success: false,
        message: "Pass is not valid yet",
      });
    }

    if (currentTime > pass.validUntil) {
      pass.status = "EXPIRED";
      await pass.save();

      return res.status(400).json({
        success: false,
        message: "Pass has expired",
      });
    }

    const existingCheckIn = await CheckIn.findOne({
      visitId: pass.visitId,
    });

    if (existingCheckIn) {
      return res.status(400).json({
        success: false,
        message: "Visitor is already checked in",
      });
    }

    const checkIn = await CheckIn.create({
      organizationId: pass.organizationId,
      visitId: pass.visitId,
      visitorId: pass.visitorId,
      checkedInBy: req.user.userId,
    });

    visit.checkInTime = checkIn.checkInTime;
    await visit.save();

    pass.status = "USED";
    await pass.save();

    res.status(200).json({
      success: true,
      message: "Pass verified and visitor checked in successfully",
      pass,
      checkIn,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while verifying the pass",
      error: error.message,
    });
  }
};

module.exports = {
  verifyPass,
};
