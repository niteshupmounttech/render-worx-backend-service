const logger = require("../utils/logger");
const buildResponse = require("../utils/response");
const fileUtil = require("../utils/FileUtil");
const portfolioRepo = require("../repositories/PortfolioRepository");
const { buildPortfolioResponse } = require("../utils/ResponseBuilder");
const Portfolio = require("../models/Portfolio");

const DataConstant = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  SHORT_ZERO: 0,
  SHORT_ONE: 1,
  SHORT_TWO: 2,
  RECORD_FOUND: "Record found",
  RECORD_NOT_FOUND: "No records found",
  SERVER_MESSAGE: "Internal Server Error",
  INVALID_REQUEST: "Invalid request",
};

async function addPortfolio(data) {
  try {
    if (!data) return buildResponse(400, "Invalid request: no data provided", null);

    logger.info(`addPortfolio: id=${data.id || "NEW"}`);

    // Upload thumbnail
    let thumbnailUrl = null;
    if (data.thumbnailFile) {
      try {
        thumbnailUrl = await fileUtil.uploadFile(data.thumbnailFile);
        logger.info(`🖼️ Uploaded thumbnail: ${thumbnailUrl}`);
      } catch (err) {
        logger.error("❌ Failed to upload thumbnail", { error: err });
      }
    }

    // Upload gallery files
    let galleryUrls = [];
    if (data.galleryFiles && data.galleryFiles.length > 0) {
      for (const file of data.galleryFiles) {
        try {
          const url = await fileUtil.uploadFile(file);
          galleryUrls.push(url);
        } catch (err) {
          logger.error("❌ Failed to upload gallery file", { error: err });
        }
      }
    }

    const safeUpdates = {
      ...data,
      thumbnailFile: thumbnailUrl || data.thumbnailFile,
      galleryFiles: galleryUrls.length > 0 ? galleryUrls : data.galleryFiles,
      updatedAt: new Date(),
    };

    let portfolio;

    if (!data.id || data.id.trim() === "") {
      portfolio = await portfolioRepo.createPortfolio(safeUpdates);
      logger.info(`Created new portfolio with id=${portfolio._id}`);
      return buildResponse(201, "Portfolio created successfully", buildPortfolioResponse(portfolio));
    }

    portfolio = await portfolioRepo.updatePortfolio(data.id, safeUpdates);
    if (!portfolio) return buildResponse(404, "Portfolio not found", null);

    return buildResponse(200, "Portfolio updated successfully", buildPortfolioResponse(portfolio));
  } catch (err) {
    logger.error(`addPortfolio error: ${err.message}`, { stack: err.stack });
    return buildResponse(500, err.message, null);
  }
}

async function getPortfolio(id) {
  try {
    const portfolio = await portfolioRepo.findById(id);
    if (!portfolio) return buildResponse(404, "Portfolio not found", null);
    return buildResponse(200, "Portfolio fetched successfully", buildPortfolioResponse(portfolio));
  } catch (err) {
    logger.error(`getPortfolio error: ${err.message}`, { stack: err.stack });
    return buildResponse(500, err.message, null);
  }
}

async function getAllPortfolios(pageIndex, pageSize, status, searchText) {
  try {
    let query = { status: { $in: [DataConstant.SHORT_ONE, DataConstant.SHORT_TWO] } };

    if (status !== undefined && status !== null && status !== "") {
      const parsedStatus = parseInt(status, 10);
      if (!isNaN(parsedStatus)) query.status = parsedStatus;
    }

    if (searchText && searchText.trim() !== "") {
      query.$or = [
        { clientName: { $regex: searchText.trim(), $options: "i" } },
        { category: { $regex: searchText.trim(), $options: "i" } },
        { city: { $regex: searchText.trim(), $options: "i" } },
      ];
    }

    const skip = pageIndex * pageSize;
    const [data, total] = await Promise.all([
      portfolioRepo.findAll(query, skip, pageSize),
      portfolioRepo.countDocuments(query),
    ]);

    const totalActive = await portfolioRepo.countDocuments({ status: 1 });
    const totalInActive = await portfolioRepo.countDocuments({ status: 2 });

    if (!data.length) return buildResponse(DataConstant.NOT_FOUND, DataConstant.RECORD_NOT_FOUND);

    return buildResponse(DataConstant.OK, DataConstant.RECORD_FOUND, {
      content: data.map(buildPortfolioResponse),
      pageIndex,
      pageSize,
      total,
      totalActive,
      totalInActive,
      totalPages: Math.ceil(total / pageSize),
      hasNext: skip + data.length < total,
      hasPrevious: pageIndex > 0,
    });
  } catch (err) {
    logger.error(`getAllPortfolios error: ${err.message}`, { stack: err.stack });
    return buildResponse(DataConstant.SERVER_ERROR, DataConstant.SERVER_MESSAGE);
  }
}

async function blockUnblockPortfolio(id, status) {
  try {
    const portfolio = await portfolioRepo.findById(id);
    if (!portfolio) return buildResponse(DataConstant.NOT_FOUND, DataConstant.RECORD_NOT_FOUND);

    if (portfolio.status === status) {
      if (status === DataConstant.SHORT_ONE) return buildResponse(DataConstant.BAD_REQUEST, "Portfolio already active");
      if (status === DataConstant.SHORT_TWO) return buildResponse(DataConstant.BAD_REQUEST, "Portfolio already inactive");
      if (status === DataConstant.SHORT_ZERO) return buildResponse(DataConstant.BAD_REQUEST, "Portfolio already deleted");
    }

    portfolio.status = status;
    portfolio.updatedAt = new Date();
    await portfolio.save();

    let message = DataConstant.INVALID_REQUEST;
    if (status === DataConstant.SHORT_ZERO) message = "Portfolio deleted successfully";
    if (status === DataConstant.SHORT_ONE) message = "Portfolio activated successfully";
    if (status === DataConstant.SHORT_TWO) message = "Portfolio deactivated successfully";

    return buildResponse(DataConstant.OK, message, buildPortfolioResponse(portfolio));
  } catch (err) {
    logger.error(`blockUnblockPortfolio error: ${err.message}`, { stack: err.stack });
    return buildResponse(DataConstant.SERVER_ERROR, DataConstant.SERVER_MESSAGE);
  }
}

async function updateFeatured(id, featured) {
  try {
    const portfolio = await portfolioRepo.findById(id);
    if (!portfolio) return buildResponse(404, "Portfolio not found", null);

    if (featured === true || featured === "true") {
      const featuredCount = await portfolioRepo.countDocuments({ featured: true, status: 1 });
      if (featuredCount >= 12) {
        return buildResponse(400, "Maximum 12 portfolios can be featured at a time", null);
      }
      portfolio.featured = true;
    } else {
      portfolio.featured = false;
    }

    portfolio.updatedAt = new Date();
    await portfolio.save();

    const message = portfolio.featured ? "Portfolio featured enabled" : "Portfolio featured disabled";
    return buildResponse(200, message, buildPortfolioResponse(portfolio));
  } catch (err) {
    logger.error(`updateFeatured error: ${err.message}`, { stack: err.stack });
    return buildResponse(500, err.message, null);
  }
}

async function getPortfoliosByCategory(category) {
  try {
    const query = { featured: true, status: 1 };
    if (category && category.trim() !== "") {
      query.category = { $regex: category.trim(), $options: "i" };
    }

    const data = await portfolioRepo.findAll(query, 0, 1000);
    if (!data.length) return buildResponse(404, DataConstant.RECORD_NOT_FOUND, null);

    return buildResponse(200, DataConstant.RECORD_FOUND, data.map(buildPortfolioResponse));
  } catch (err) {
    logger.error(`getPortfoliosByCategory error: ${err.message}`, { stack: err.stack });
    return buildResponse(500, err.message, null);
  }
}

module.exports = { addPortfolio, getPortfolio, getAllPortfolios, blockUnblockPortfolio, updateFeatured, getPortfoliosByCategory };
