const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const axios = require("axios");
const XLSX = require("xlsx");
const logger = require("./logger");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadPath = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  logger.info(`📂 Created uploads directory at: ${uploadPath}`);
}

/**
 * Upload a file from multer to S3
 */
async function uploadFile(file, folder = "general") {
  try {
    if (!file) {
      logger.warn("⚠️ No file provided to uploadFile()");
      return null;
    }

    const ext = path.extname(file.originalname);
    const fileName = `${folder}/${crypto.randomUUID()}${ext}`;

    const buffer = file.buffer || fs.readFileSync(file.path);

    await s3.send(new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.mimetype,
    }));

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    logger.info(`✅ File uploaded to S3: ${file.originalname} → ${fileUrl}`);
    return fileUrl;
  } catch (err) {
    logger.error("❌ uploadFile S3 error", { error: err });
    throw err;
  }
}

/**
 * Download an image from URL and upload to S3
 */
async function downloadImage(imageUrl) {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const contentType = response.headers["content-type"] || "image/jpeg";

    const extMap = { "image/jpeg": "jpg", "image/png": "png", "image/gif": "gif", "image/webp": "webp", "image/bmp": "bmp", "image/svg+xml": "svg" };
    const ext = extMap[contentType] || "jpg";
    const fileName = crypto.randomUUID() + "." + ext;

    await s3.send(new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: Buffer.from(response.data),
      ContentType: contentType,
    }));

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    logger.info(`⬇️ Image downloaded and uploaded to S3: ${imageUrl} → ${fileUrl}`);
    return fileUrl;
  } catch (err) {
    logger.error("❌ downloadImage error", { error: err, url: imageUrl });
    return null;
  }
}

/**
 * Extract base64 images from xlsx sheet
 * Note: XLSX does not preserve binary images like Apache POI,
 * but embedded images as base64 in cells can be handled
 */
function extractPictures(sheet) {
  try {
    const pictureMap = {};
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true });

    rows.forEach((row, rowIdx) => {
      row.forEach((cell, colIdx) => {
        if (cell && typeof cell === "string" && cell.startsWith("data:image")) {
          pictureMap[`${rowIdx}-${colIdx}`] = cell;
          logger.info(`🖼️ Found embedded image at cell ${rowIdx}-${colIdx}`);
        }
      });
    });

    return pictureMap;
  } catch (err) {
    logger.error("❌ extractPictures error", { error: err });
    return {};
  }
}

/**
 * Save base64 image from sheet cell
 */
function saveImageFromCell(rowIdx, colIdx, pictureMap, prefix) {
  try {
    const key = `${rowIdx}-${colIdx}`;
    if (!pictureMap[key]) {
      logger.warn(`⚠️ No image found at cell ${key}`);
      return null;
    }

    const base64Data = pictureMap[key].split(",")[1]; // remove "data:image/png;base64,"
    const extMatch = pictureMap[key].match(/^data:image\/([a-zA-Z]+);base64,/);
    const ext = extMatch ? extMatch[1] : "png";

    const fileName = `${prefix}_${crypto.randomUUID()}.${ext}`;
    const filePath = path.join(uploadPath, fileName);
    fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));

    const fileUrl = getPath + fileName;
    logger.info(`💾 Saved image from sheet cell ${key} → ${fileUrl}`);
    return fileUrl;
  } catch (err) {
    logger.error("❌ saveImageFromCell error", { error: err });
    return null;
  }
}

module.exports = {
  uploadFile,
  downloadImage,
  extractPictures,
  saveImageFromCell,
};
