const ort = require("onnxruntime-node");

const { preprocessFaceImage } = require("./facePreprocessingService");

const MODEL_PATH = "./models/face/facenet.onnx";

const generateFaceEmbedding = async (imagePath) => {
  const processed = await preprocessFaceImage(imagePath);

  const inputTensor = new ort.Tensor(
    "float32",
    processed.data,
    [1, 160, 160, 3],
  );

  const session = await ort.InferenceSession.create(MODEL_PATH);

  const results = await session.run({
    input: inputTensor,
  });

  const embedding = results.Bottleneck_BatchNorm.data;

  return Array.from(embedding);
};

const compareFaceEmbeddings = (storedEmbedding, newEmbedding) => {
  if (!storedEmbedding || !newEmbedding) {
    throw new Error("Face embeddings are required");
  }

  if (storedEmbedding.length !== newEmbedding.length) {
    throw new Error("Face embeddings must have the same length");
  }

  let sum = 0;

  for (let i = 0; i < storedEmbedding.length; i++) {
    const difference = storedEmbedding[i] - newEmbedding[i];

    sum += difference * difference;
  }

  const distance = Math.sqrt(sum);

  const threshold = 0.6;

  return {
    distance,
    matched: distance <= threshold,
  };
};

module.exports = {
  generateFaceEmbedding,
  compareFaceEmbeddings,
};
