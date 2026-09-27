const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const extractDocumentDetails = async (ocrText) => {
    const prompt = `
You are a document information extraction assistant for SmartPass AI.

Extract the following information from the OCR text:

- fullName
- idNumber
- dateOfBirth
- documentType

Possible document types:
AADHAAR, PAN, PASSPORT, DRIVING_LICENSE, OTHER

OCR TEXT:
${ocrText}

Return ONLY a valid JSON object.

Use exactly this structure:
{
    "fullName": null,
    "idNumber": null,
    "dateOfBirth": null,
    "documentType": null
}

If a field is not available, keep its value null.
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
    });

    return JSON.parse(response.text);
};

module.exports = {
    extractDocumentDetails
};
