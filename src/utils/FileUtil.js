const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const axios = require("axios");
const XLSX = require("xlsx");
const logger = require("./logger"); // ✅ import logger

// const uploadPath = path.join(__dirname, "..", "uploads");
// const getPath = "/uploads/"; // URL prefix for served files

const uploadPath = path.join(__dirname, "..", "uploads");
const getPath = process.env.BASE_URL + "/uploads/";


// Ensure upload folder exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  logger.info(`📂 Created uploads directory at: ${uploadPath}`);
}

/**
 * Upload a file from multer
 */
async function uploadFile(file) {
  try {
    if (!file) {
      logger.warn("⚠️ No file provided to uploadFile()");
      return null;
    }

    const ext = path.extname(file.originalname);
    const fileName = crypto.randomUUID() + ext;
    const filePath = path.join(uploadPath, fileName);

    // If file.buffer exists (memoryStorage)
    if (file.buffer) {
      fs.writeFileSync(filePath, file.buffer);
    } 
    // If file.path exists (diskStorage)
    else if (file.path) {
      fs.copyFileSync(file.path, filePath);
    } else {
      throw new Error("Invalid file object: missing buffer or path");
    }

    const fileUrl = getPath + fileName;

    logger.info(`✅ File uploaded: ${file.originalname} → ${fileUrl}`);
    return fileUrl;
  } catch (err) {
    logger.error("❌ uploadFile error", { error: err });
    throw err;
  }
}

/**
 * Download an image from URL and save locally
 */
async function downloadImage(imageUrl) {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    let ext = "jpg";

    const contentType = response.headers["content-type"];
    if (contentType) {
      switch (contentType) {
        case "image/jpeg":
          ext = "jpg";
          break;
        case "image/png":
          ext = "png";
          break;
        case "image/gif":
          ext = "gif";
          break;
        case "image/webp":
          ext = "webp";
          break;
        case "image/bmp":
          ext = "bmp";
          break;
        case "image/svg+xml":
          ext = "svg";
          break;
        default:
          ext = "jpg";
      }
    }

    const fileName = crypto.randomUUID() + "." + ext;
    const filePath = path.join(uploadPath, fileName);
    fs.writeFileSync(filePath, response.data);
    const fileUrl = getPath + fileName;

    logger.info(`⬇️ Image downloaded from ${imageUrl} → ${fileUrl}`);
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
