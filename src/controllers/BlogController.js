const blogService = require("../services/BlogService");
const buildResponse = require("../utils/response");
const logger = require("../utils/logger");

exports.addBlog = async (req, res) => {
  try {
    const result = await blogService.addBlog({
      ...req.body,
      thumbnailFile: req.files?.thumbnailFile?.[0] || null,
      mediaFiles: req.files?.mediaFiles || [],
    });
    res.status(200).json(result);
  } catch (err) {
    logger.error("❌ addBlog controller error", { error: err });
    res.status(500).json(buildResponse(500, err.message, null));
  }
};

exports.getBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await blogService.getBlog(id);
    res.status(200).json(result);
  } catch (err) {
    logger.error("❌ getBlog controller error", { error: err });
    res.status(500).json(buildResponse(500, err.message, null));
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    let { pageIndex = 0, pageSize = 10, status, searchText } = req.query;
    pageIndex = parseInt(pageIndex, 10);
    pageSize = parseInt(pageSize, 10);
    searchText = typeof searchText === "string" ? searchText.trim() : "";

    const result = await blogService.getAllBlogs(pageIndex, pageSize, status, searchText);
    res.status(200).json(result);
  } catch (err) {
    logger.error("❌ getAllBlogs controller error", { error: err });
    res.status(200).json(buildResponse(500, "Internal server error", null));
  }
};

exports.blockUnblockBlog = async (req, res) => {
  try {
    const { id, status } = req.body;
    const result = await blogService.blockUnblockBlog(id, status);
    res.status(200).json(result);
  } catch (err) {
    logger.error("❌ blockUnblockBlog controller error", { error: err });
    res.status(500).json(buildResponse(500, err.message, null));
  }
};
