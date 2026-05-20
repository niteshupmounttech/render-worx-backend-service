const ourServiceService = require("../services/OurServiceService");
const buildResponse = require("../utils/response");
const logger = require("../utils/logger");

exports.addService = async (req, res) => {
  try {
    const result = await ourServiceService.addService({
      ...req.body,
      icon: req.files?.icon?.[0] || null,
      thumbnailFile: req.files?.thumbnailFile?.[0] || null,
      galleryFiles: req.files?.galleryFiles || [],
    });
    res.status(200).json(result);
  } catch (err) {
    logger.error("❌ addService controller error", { error: err });
    res.status(500).json(buildResponse(500, err.message, null));
  }
};

exports.getService = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ourServiceService.getService(id);
    res.status(200).json(result);
  } catch (err) {
    logger.error("❌ getService controller error", { error: err });
    res.status(500).json(buildResponse(500, err.message, null));
  }
};

exports.getAllServices = async (req, res) => {
  try {
    let { pageIndex = 0, pageSize = 10, status, searchText } = req.query;
    pageIndex = parseInt(pageIndex, 10);
    pageSize = parseInt(pageSize, 10);
    searchText = typeof searchText === "string" ? searchText.trim() : "";

    const result = await ourServiceService.getAllServices(pageIndex, pageSize, status, searchText);
    res.status(200).json(result);
  } catch (err) {
    logger.error("❌ getAllServices controller error", { error: err });
    res.status(200).json(buildResponse(500, "Internal server error", null));
  }
};

exports.blockUnblockService = async (req, res) => {
  try {
    const { id, status } = req.body;
    const result = await ourServiceService.blockUnblockService(id, status);
    res.status(200).json(result);
  } catch (err) {
    logger.error("❌ blockUnblockService controller error", { error: err });
    res.status(500).json(buildResponse(500, err.message, null));
  }
};
