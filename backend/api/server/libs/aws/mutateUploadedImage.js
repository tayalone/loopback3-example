const AWS = require("aws-sdk");
const sharp = require("sharp");
// const {
//   AWS_S3_SECRET_ACCESS_KEY,
//   AWS_S3_ACCESS_KEY_ID,
//   AWS_S3_BUCKET_NAME,
// } = require("../../variables");

// ------------------------------------------------
// Initialize AWS.S3 client instance.
// ------------------------------------------------
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  Bucket: process.env.AWS_S3_BUCKET_NAMES,
});

const mutateUploadedImages = async (
  dimensions,
  buffer,
  extension,
  fileName,
  prefixKey
) => {
  return dimensions.map((dimsn, i) => {
    return new Promise(async (resolve, reject) => {
      const newImage = await sharp(buffer)
        .resize(dimsn.width, dimsn.height)
        .jpeg({ quality: 100, progressive: true })
        .toBuffer();
      //   console.log(newImage);

      const curntTimestamp = String(Date.now());

      let metaData = null;
      let name = null;
      if (dimsn.type != "source") {
        name = `${fileName}-${dimsn.type}-${curntTimestamp}.jpeg`;
        metaData = {
          Bucket: process.env.AWS_S3_BUCKET_NAMES,
          ACL: "public-read",
          Key: `${prefixKey}${name}`,
          Body: newImage,
        };
      } else {
        name = `${fileName}-source-${curntTimestamp}${extension}`;
        metaData = {
          Bucket: process.env.AWS_S3_BUCKET_NAMES,
          ACL: "public-read",
          Key: `${prefixKey}${name}`,
          Body: buffer,
        };
      }

      // ------------------------------------------------
      // Actual File Uploading Process.
      // ------------------------------------------------
      s3.upload(metaData, (err, data) => {
        if (err) {
          console.log(err);
        }
        resolve({ ...data, name: name, type: dimsn.type });
      });
    });
  });
};

module.exports = mutateUploadedImages;
