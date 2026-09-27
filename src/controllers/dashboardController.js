const mongoose = require("mongoose");
const Visit = require("../models/visit");
const CheckIn = require("../models/checkIn");
const Queue = require("../models/queue");

const getDashboardSummary = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todaysVisitors = await Visit.countDocuments({
      organizationId,
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    const currentlyInside = await CheckIn.countDocuments({
      organizationId,
      status: "CHECKED_IN",
    });

    const waitingInQueue = await Queue.countDocuments({
      organizationId,
      status: "WAITING",
    });

    const completedVisits = await Visit.countDocuments({
      organizationId,
      status: "COMPLETED",
    });

    res.status(200).json({
      success: true,
      summary: {
        todaysVisitors,
        currentlyInside,
        waitingInQueue,
        completedVisits,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get dashboard summary",
      error: error.message,
    });
  }
};

const getVisitorStats = async (req, res) => {
  try {
    const organizationId = new mongoose.Types.ObjectId(req.user.organizationId);

    const stats = await Visit.aggregate([
      {
        $match: {
          organizationId: organizationId,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          visitors: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get visitor statistics",
      error: error.message,
    });
  }
};

const getVisitPurposeStats = async (req, res) => {
  try {
    const organizationId = new mongoose.Types.ObjectId(req.user.organizationId);

    const stats = await Visit.aggregate([
      {
        $match: {
          organizationId: organizationId,
        },
      },
      {
        $group: {
          _id: "$purpose",
          visits: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          visits: -1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get visit purpose statistics",
      error: error.message,
    });
  }
};

const getPeakHours = async (req, res) => {
  try {
    const organizationId = new mongoose.Types.ObjectId(req.user.organizationId);

    const stats = await Visit.aggregate([
      {
        $match: {
          organizationId: organizationId,
        },
      },
      {
        $group: {
          _id: {
            $hour: "$createdAt",
          },
          visits: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get peak visiting hours",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardSummary,
  getVisitorStats,
  getVisitPurposeStats,
  getPeakHours
};
