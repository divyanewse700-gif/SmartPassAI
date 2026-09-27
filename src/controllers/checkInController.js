const CheckIn = require("../models/checkIn");
const Visit = require("../models/visit");

const checkInVisitor = async (req, res) => {
  try {
    const { organizationId, visitId, visitorId } = req.body;

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
        message: "Visit must be approved before check-in",
      });
    }

    const existingCheckIn = await CheckIn.findOne({
      visitId,
    });

    if (existingCheckIn) {
      return res.status(400).json({
        success: false,
        message: "Visitor is already checked in",
      });
    }

    const checkIn = await CheckIn.create({
      organizationId,
      visitId,
      visitorId,
      checkedInBy: req.user.userId,
    });

    visit.checkInTime = checkIn.checkInTime;
    await visit.save();

    res.status(201).json({
      success: true,
      message: "Visitor checked in successfully",
      checkIn,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to check in visitor",
      error: error.message,
    });
  }
};

const getActiveCheckIns = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;

    const checkIns = await CheckIn.find({
      organizationId,
      status: "CHECKED_IN",
    }).sort({ checkInTime: -1 });

    res.status(200).json({
      success: true,
      checkIns,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get active check-ins",
      error: error.message,
    });
  }
};

module.exports = {
  checkInVisitor,
  getActiveCheckIns,
};
