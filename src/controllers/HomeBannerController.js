const homeBannerService = require("../services/HomeBannerService");
const buildResponse = require("../utils/response");
const logger = require("../utils/logger");

exports.getHomeBanner = async (req, res) => {
  try {
    const result = await homeBannerService.getHomeBanner();
    res.status(200).json(buildResponse(result.responseCode, result.message, result.responseBody));
  } catch (error) {
    logger.error("❌ getHomeBanner controller error", { error });
    res.status(500).json(buildResponse(500, "Internal server error", null));
  }
};

exports.updateHomeBanner = async (req, res) => {
  try {
    const { type } = req.body;
    const mediaFile = req.files?.mediaFile?.[0] || null;
    const result = await homeBannerService.updateHomeBanner(mediaFile, type);
    res.status(200).json(buildResponse(result.responseCode, result.message, result.responseBody));
  } catch (error) {
    logger.error("❌ updateHomeBanner controller error", { error });
    res.status(500).json(buildResponse(500, "Internal server error", null));
  }
};
