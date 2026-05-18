const HomeBanner = require("../models/HomeBanner");
const logger = require("../utils/logger");
const fileUtil = require("../utils/FileUtil");
const { buildHomeBannerResponse } = require("../utils/ResponseBuilder");

async function getHomeBanner() {
  try {
    const banner = await HomeBanner.findOne();
    if (!banner) return { responseCode: 404, message: "Home banner not found", responseBody: null };
    return { responseCode: 200, message: "Home banner fetched successfully", responseBody: buildHomeBannerResponse(banner) };
  } catch (error) {
    logger.error("❌ Error in getHomeBanner", { error });
    return { responseCode: 500, message: "Server error", responseBody: null };
  }
}

async function updateHomeBanner(mediaFile, type) {
  try {
    if (!type) return { responseCode: 400, message: "Field 'type' is required", responseBody: null };

    let mediaUrl = null;
    if (mediaFile) {
      try {
        mediaUrl = await fileUtil.uploadFile(mediaFile);
        logger.info(`📸 Uploaded banner media: ${mediaUrl}`);
      } catch (err) {
        logger.error("❌ Failed to upload banner media", { error: err });
      }
    }

    const updated = await HomeBanner.findOneAndUpdate(
      {},
      { $set: { mediaFiles: mediaUrl || "", type } },
      { new: true, upsert: true }
    );
    return { responseCode: 200, message: "Home banner updated successfully", responseBody: buildHomeBannerResponse(updated) };
  } catch (error) {
    logger.error("❌ Error in updateHomeBanner", { error });
    return { responseCode: 500, message: "Server error", responseBody: null };
  }
}

module.exports = { getHomeBanner, updateHomeBanner };
