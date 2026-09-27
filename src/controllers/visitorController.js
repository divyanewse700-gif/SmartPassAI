const Visitor = require("../models/visitor");
const {
  generateFaceEmbedding,
} = require("../services/faceVerificationService");

const createVisitor = async (req, res) => {
  try {
    const {
      organizationId,
      fullName,
      phone,
      email,
      photo,
      idProofType,
      idProofNumber,
      idProofImage,
    } = req.body;

    const visitor = await Visitor.create({
      organizationId,
      fullName,
      phone,
      email,
      photo,
      idProofType,
      idProofNumber,
      idProofImage,
    });

    res.status(201).json({
      success: true,
      message: "Visitor registered successfully",
      visitor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to register visitor",
      error: error.message,
    });
  }
};

const registerVisitorFace = async (req, res) => {
  try {
    const { visitorId } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Face image is required",
      });
    }

    if (!visitorId) {
      return res.status(400).json({
        success: false,
        message: "Visitor ID is required",
      });
    }

    const visitor = await Visitor.findById(visitorId);

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    const embedding = await generateFaceEmbedding(req.file.path);

    visitor.faceEmbedding = embedding;
    visitor.photo = req.file.path;

    await visitor.save();

    res.status(200).json({
      success: true,
      message: "Visitor face registered successfully",
      visitorId: visitor._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to register visitor face",
      error: error.message,
    });
  }
};

module.exports = {
  createVisitor,
  registerVisitorFace,
};
