const Visitor = require("../models/visitor");

const { extractTextFromImage } = require("../services/documentOCRService");

const { extractDocumentDetails } = require("../services/aiDocumentService");

const analyzeDocument = async (req, res) => {
  try {
    const { visitorId } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Document image is required",
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

    const ocrText = await extractTextFromImage(req.file.path);

    const documentDetails = await extractDocumentDetails(ocrText);

    visitor.fullName = documentDetails.fullName || visitor.fullName;

    visitor.idProofNumber = documentDetails.idNumber || visitor.idProofNumber;

    visitor.idProofType = documentDetails.documentType || visitor.idProofType;

    visitor.idProofImage = req.file.path;

    await visitor.save();

    res.status(200).json({
      success: true,
      message: "Document analyzed and visitor updated successfully",
      visitor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to analyze document",
      error: error.message,
    });
  }
};

module.exports = {
  analyzeDocument,
};
