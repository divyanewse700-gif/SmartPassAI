const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema(
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

        hostId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        purpose: {
            type: String,
            required: true,
            trim: true
        },

        visitDate: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "APPROVED",
                "REJECTED",
                "CANCELLED",
                "COMPLETED"
            ],
            default: "PENDING"
        },

        checkInTime: {
            type: Date,
            default: null
        },

        checkOutTime: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Visit", visitSchema);