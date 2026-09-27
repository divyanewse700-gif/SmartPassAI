const mongoose = require("mongoose");

const queueSchema = new mongoose.Schema(
    {
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true
        },

        visitorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Visitor",
            required: true
        },

        visitId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Visit",
            required: true
        },

        queueNumber: {
            type: Number,
            required: true
        },

        serviceType: {
            type: String,
            required: true,
            trim: true
        },

        priority: {
            type: String,
            enum: ["NORMAL", "PRIORITY", "EMERGENCY"],
            default: "NORMAL"
        },

        status: {
            type: String,
            enum: [
                "WAITING",
                "CALLED",
                "IN_PROGRESS",
                "COMPLETED",
                "CANCELLED"
            ],
            default: "WAITING"
        },

        joinedAt: {
            type: Date,
            default: Date.now
        },

        calledAt: {
            type: Date,
            default: null
        },

        completedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Queue", queueSchema);