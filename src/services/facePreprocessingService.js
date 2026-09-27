const sharp = require("sharp");

const preprocessFaceImage = async (imagePath) => {
  const { data, info } = await sharp(imagePath)
    .resize(160, 160)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const floatData = new Float32Array(data.length);

  for (let i = 0; i < data.length; i++) {
    floatData[i] = data[i] / 255.0;
  }

  return {
    data: floatData,
    width: info.width,
    height: info.height,
    channels: info.channels,
  };
};

module.exports = {
  preprocessFaceImage,
};
