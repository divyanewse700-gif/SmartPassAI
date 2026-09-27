const Visit = require("../models/visit");

const createVisit = async (req, res) => {
  try {
    const { organizationId, visitorId, hostId, purpose, visitDate } = req.body;

    const visit = await Visit.create({
      organizationId,
      visitorId,
      hostId,
      purpose,
      visitDate,
    });

    res.status(201).json({
      success: true,
      message: "Visit created successfully",
      visit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create visit",
      error: error.message,
    });
  }
};

const getVisits = async (req, res) => {
    try {
        const organizationId = req.user.organizationId;

        const visits = await Visit.find({
            organizationId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            visits
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get visits",
            error: error.message
        });
    }
};

module.exports = {
  createVisit,
   getVisits
};
