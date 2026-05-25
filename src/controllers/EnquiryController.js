const enquiryService = require("../services/EnquiryService");
const buildResponse = require("../utils/response");
const logger = require("../utils/logger");

exports.addEnquiry = async (req, res) => {
  try {
    const result = await enquiryService.addEnquiry(req.body);
    res.status(200).json(result);
  } catch (err) {
    logger.error("❌ addEnquiry controller error", { error: err });
    res.status(500).json(buildResponse(500, err.message, null));
  }
};

exports.getEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await enquiryService.getEnquiry(id);
    res.status(200).json(result);
  } catch (err) {
    logger.error("❌ getEnquiry controller error", { error: err });
    res.status(500).json(buildResponse(500, err.message, null));
  }
};

exports.readEnquiry = async (req, res) => {
  try {
    const { id, read } = req.body;
    const result = await enquiryService.readEnquiry(id, read);
    res.status(200).json(result);
  } catch (err) {
    logger.error("❌ readEnquiry controller error", { error: err });
    res.status(500).json(buildResponse(500, err.message, null));
  }
};

exports.blockUnblockEnquiry = async (req, res) => {
  try {
    const { id, status } = req.body;
    const result = await enquiryService.blockUnblockEnquiry(id, status);
    res.status(200).json(result);
  } catch (err) {
    logger.error("❌ blockUnblockEnquiry controller error", { error: err });
    res.status(500).json(buildResponse(500, err.message, null));
  }
};

exports.getAllEnquiries = async (req, res) => {
  try {
    pageIndex = parseInt(pageIndex, 10);
    pageSize = parseInt(pageSize, 10);
    searchText = typeof searchText === "string" ? searchText.trim() : "";
    const result = await enquiryService.getAllEnquiries(pageIndex, pageSize, status, searchText);
    res.status(200).json(result);
  } catch (err) {
    logger.error("❌ getAllEnquiries controller error", { error: err });
    res.status(200).json(buildResponse(500, "Internal server error", null));
  }
};
