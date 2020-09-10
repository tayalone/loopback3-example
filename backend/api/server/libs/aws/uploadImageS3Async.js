const fs = require("fs");
const path = require("path");

const mutateUploadedImage = require("./mutateUploadedImage");

const uploadImageS3Async = async (image, dimensions, awsPath) => {
  console.log(`awsPath`, awsPath);
  console.log(`image`, image);
  const { path: filePath, originalFilename } = image;
  console.log(`filePath`, filePath);
  // console.log(`dimensions`, dimensions)
  try {
    const extension = await path.extname(String(filePath));
    const fileName = await path.basename(originalFilename, extension);
    // console.log(`extension`, extension);
    // console.log(`fileName`, fileName);

    const buffer = await fs.readFileSync(filePath);

    const newFileName = fileName.replace(/ /gi, "_");

    const dimensionsObj = JSON.parse(dimensions);
    const mutatedImages = await mutateUploadedImage(
      dimensionsObj,
      buffer,
      extension,
      newFileName,
      awsPath
    );
    // console.log(`before await Promise.all(mutatedImages)`)
    const result = await Promise.all(mutatedImages);
    // console.log(`result`, result)

    return { isSuccess: true, result };
  } catch (e) {
    console.log(`e`, e);
    return { isSuccess: false };
  } finally {
    await fs.unlinkSync(filePath);
  }
};

module.exports = uploadImageS3Async;
