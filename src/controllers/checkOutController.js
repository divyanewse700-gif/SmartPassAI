const CheckIn = require("../models/checkIn");
const Visit = require("../models/visit");

const checkOutVisitor = async (req, res) => {
  try {
    const { checkInId } = req.params;

    const checkIn = await CheckIn.findById(checkInId);

    if (!checkIn) {
      return res.status(404).json({
        success: false,
        message: "Check-in record not found",
      });
    }

    if (checkIn.status === "CHECKED_OUT") {
      return res.status(400).json({
        success: false,
        message: "Visitor is already checked out",
      });
    }

    const checkOutTime = new Date();

    checkIn.checkOutTime = checkOutTime;
    checkIn.status = "CHECKED_OUT";

    await checkIn.save();

    const visit = await Visit.findById(checkIn.visitId);

    if (visit) {
      visit.checkOutTime = checkOutTime;
      visit.status = "COMPLETED";

      await visit.save();
    }

    res.status(200).json({
      success: true,
      message: "Visitor checked out successfully",
      checkIn,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to check out visitor",
      error: error.message,
    });
  }
};

module.exports = {
  checkOutVisitor,
};
