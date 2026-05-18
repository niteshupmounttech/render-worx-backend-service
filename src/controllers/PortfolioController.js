const portfolioService = require("../services/PortfolioService");
const buildResponse = require("../utils/response");
const logger = require("../utils/logger");

exports.addPortfolio = async (req, res) => {
  try {
    const result = await portfolioService.addPortfolio({
      ...req.body,
      thumbnailFile: req.files?.thumbnailFile?.[0] || null,
      galleryFiles: req.files?.galleryFiles || [],
    });
    res.status(200).json(result);
  } catch (err) {
    logger.error("❌ addPortfolio controller error", { error: err });
    res.status(500).json(buildResponse(500, err.message, null));
  }
};

exports.getPortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await portfolioService.getPortfolio(id);
    res.status(200).json(result);
  } catch (err) {
    logger.error("❌ getPortfolio controller error", { error: err });
    res.status(500).json(buildResponse(500, err.message, null));
  }
};

exports.getAllPortfolios = async (req, res) => {
  try {
    let { pageIndex = 0, pageSize = 10, status, searchText } = req.query;
    pageIndex = parseInt(pageIndex, 10);
    pageSize = parseInt(pageSize, 10);
    searchText = typeof searchText === "string" ? searchText.trim() : "";

    const result = await portfolioService.getAllPortfolios(pageIndex, pageSize, status, searchText);
    res.status(200).json(result);
  } catch (err) {
    logger.error("❌ getAllPortfolios controller error", { error: err });
    res.status(200).json(buildResponse(500, "Internal server error", null));
  }
};

exports.blockUnblockPortfolio = async (req, res) => {
  try {
    const { id, status } = req.body;
    const result = await portfolioService.blockUnblockPortfolio(id, status);
    res.status(200).json(result);
  } catch (err) {
    logger.error("❌ blockUnblockPortfolio controller error", { error: err });
    res.status(500).json(buildResponse(500, err.message, null));
  }
};

exports.updateFeatured = async (req, res) => {
  try {
    const { id, featured } = req.body;
    const result = await portfolioService.updateFeatured(id, featured);
    res.status(200).json(result);
  } catch (err) {
    logger.error("❌ updateFeatured controller error", { error: err });
    res.status(500).json(buildResponse(500, err.message, null));
  }
};

exports.getPortfoliosByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    const result = await portfolioService.getPortfoliosByCategory(category);
    res.status(200).json(result);
  } catch (err) {
    logger.error("❌ getPortfoliosByCategory controller error", { error: err });
    res.status(500).json(buildResponse(500, err.message, null));
  }
};
