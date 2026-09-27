const Queue = require("../models/queue");
const Visit = require("../models/visit");

const createQueueEntry = async (req, res) => {
  try {
    const { organizationId, visitorId, visitId, serviceType, priority } =
      req.body;

    // Find the latest queue number for this organization
    const lastQueueEntry = await Queue.findOne({
      organizationId,
      serviceType,
    }).sort({ queueNumber: -1 });

    const queueNumber = lastQueueEntry ? lastQueueEntry.queueNumber + 1 : 1;

    const queueEntry = await Queue.create({
      organizationId,
      visitorId,
      visitId,
      queueNumber,
      serviceType,
      priority: priority || "NORMAL",
    });

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
        message: "Visit must be approved before adding to queue",
      });
    }

    const existingQueueEntry = await Queue.findOne({
      visitId,
    });

    if (existingQueueEntry) {
      return res.status(400).json({
        success: false,
        message: "This visit is already in the queue",
      });
    }

    res.status(201).json({
      success: true,
      message: "Visitor added to queue successfully",
      queue: queueEntry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add visitor to queue",
      error: error.message,
    });
  }
};

const getQueues = async (req, res) => {
  try {
    const { status, serviceType, priority } = req.query;
    const organizationId = req.user.organizationId;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (serviceType) {
      filter.serviceType = serviceType;
    }

    if (priority) {
      filter.priority = priority;
    }

    filter.organizationId = organizationId;

    const queues = await Queue.find(filter);

    res.status(200).json({
      success: true,
      queues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get queues",
      error: error.message,
    });
  }
};

module.exports = {
  createQueueEntry,
  getQueues,
};
