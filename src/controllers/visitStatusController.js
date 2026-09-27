const Visit = require("../models/visit");
const User = require("../models/user");
const { sendNotificationEmail } = require("../services/notificationService");

const updateVisitStatus = async (req, res) => {
  try {
    const { visitId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["APPROVED", "REJECTED", "CANCELLED"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid visit status",
      });
    }

    const visit = await Visit.findById(visitId);

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Visit not found",
      });
    }

    visit.status = status;

    await visit.save();

    if (status === "APPROVED") {
      const host = await User.findById(visit.hostId);

      if (host && host.email) {
        await sendNotificationEmail(
          host.email,
          "SmartPass AI - Visit Approved",
          `Your visit request has been approved.\n\nPurpose: ${visit.purpose}\nVisit Date: ${visit.visitDate}`,
        );
      }
    }

    res.status(200).json({
      success: true,
      message: "Visit status updated successfully",
      visit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update visit status",
      error: error.message,
    });
  }
};

module.exports = {
  updateVisitStatus,
};
