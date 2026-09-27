const Queue = require("../models/queue");

const updateQueueStatus = async (req, res) => {
  try {
    const { queueId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "WAITING",
      "CALLED",
      "IN_PROGRESS",
      "COMPLETED",
      "CANCELLED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid queue status",
      });
    }

    const queueEntry = await Queue.findById(queueId);

    if (!queueEntry) {
      return res.status(404).json({
        success: false,
        message: "Queue entry not found",
      });
    }

    const currentStatus = queueEntry.status;

    const validTransitions = {
      WAITING: ["CALLED", "CANCELLED"],
      CALLED: ["IN_PROGRESS", "CANCELLED"],
      IN_PROGRESS: ["COMPLETED", "CANCELLED"],
      COMPLETED: [],
      CANCELLED: [],
    };

    if (!validTransitions[currentStatus].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change queue status from ${currentStatus} to ${status}`,
      });
    }

    queueEntry.status = status;

    if (status === "CALLED") {
      queueEntry.calledAt = new Date();
    }

    if (status === "COMPLETED") {
      queueEntry.completedAt = new Date();
    }

    await queueEntry.save();

    res.status(200).json({
      success: true,
      message: "Queue status updated successfully",
      queue: queueEntry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update queue status",
      error: error.message,
    });
  }
};

module.exports = {
  updateQueueStatus,
};
