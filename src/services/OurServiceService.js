const logger = require("../utils/logger");
const buildResponse = require("../utils/response");
const fileUtil = require("../utils/FileUtil");
const ourServiceRepo = require("../repositories/OurServiceRepository");
const { buildOurServiceResponse } = require("../utils/ResponseBuilder");

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

async function addService(data) {
  try {
    if (!data) return buildResponse(400, "Invalid request: no data provided", null);

    logger.info(`addService: id=${data.id || "NEW"}`);

    // Upload icon
    let iconUrl = null;
    if (data.icon) {
      try {
        iconUrl = await fileUtil.uploadFile(data.icon, "service");
        logger.info(`🎨 Uploaded icon: ${iconUrl}`);
      } catch (err) {
        logger.error("❌ Failed to upload icon", { error: err });
      }
    }

    // Upload thumbnail
    let thumbnailUrl = null;
    if (data.thumbnailFile) {
      try {
        thumbnailUrl = await fileUtil.uploadFile(data.thumbnailFile, "service");
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
          const url = await fileUtil.uploadFile(file, "service");
          galleryUrls.push(url);
        } catch (err) {
          logger.error("❌ Failed to upload gallery file", { error: err });
        }
      }
    }

    const safeUpdates = {
      ...data,
      icon: iconUrl || data.icon,
      thumbnailFile: thumbnailUrl || data.thumbnailFile,
      galleryFiles: galleryUrls.length > 0 ? galleryUrls : data.galleryFiles,
      updatedAt: new Date(),
    };

    let service;

    if (!data.id || data.id.trim() === "") {
      service = await ourServiceRepo.createService(safeUpdates);
      logger.info(`Created new service with id=${service._id}`);
      return buildResponse(201, "Service created successfully", buildOurServiceResponse(service));
    }

    service = await ourServiceRepo.updateService(data.id, safeUpdates);
    if (!service) return buildResponse(404, "Service not found", null);

    return buildResponse(200, "Service updated successfully", buildOurServiceResponse(service));
  } catch (err) {
    logger.error(`addService error: ${err.message}`, { stack: err.stack });
    return buildResponse(500, err.message, null);
  }
}

async function getService(id) {
  try {
    const service = await ourServiceRepo.findById(id);
    if (!service) return buildResponse(404, "Service not found", null);
    return buildResponse(200, "Service fetched successfully", buildOurServiceResponse(service));
  } catch (err) {
    logger.error(`getService error: ${err.message}`, { stack: err.stack });
    return buildResponse(500, err.message, null);
  }
}

async function getAllServices(pageIndex, pageSize, status, searchText) {
  try {
    let query = { status: { $in: [DataConstant.SHORT_ONE, DataConstant.SHORT_TWO] } };

    if (status !== undefined && status !== null && status !== "") {
      const parsedStatus = parseInt(status, 10);
      if (!isNaN(parsedStatus)) query.status = parsedStatus;
    }

    if (searchText && searchText.trim() !== "") {
      query.$or = [
        { title: { $regex: searchText.trim(), $options: "i" } },
        { subTitle: { $regex: searchText.trim(), $options: "i" } },
      ];
    }

    const skip = pageIndex * pageSize;
    const [data, total] = await Promise.all([
      ourServiceRepo.findAll(query, skip, pageSize),
      ourServiceRepo.countDocuments(query),
    ]);

    const totalActive = await ourServiceRepo.countDocuments({ status: 1 });
    const totalInActive = await ourServiceRepo.countDocuments({ status: 2 });

    if (!data.length) return buildResponse(DataConstant.NOT_FOUND, DataConstant.RECORD_NOT_FOUND);

    return buildResponse(DataConstant.OK, DataConstant.RECORD_FOUND, {
      content: data.map(buildOurServiceResponse),
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
    logger.error(`getAllServices error: ${err.message}`, { stack: err.stack });
    return buildResponse(DataConstant.SERVER_ERROR, DataConstant.SERVER_MESSAGE);
  }
}

async function blockUnblockService(id, status) {
  try {
    const service = await ourServiceRepo.findById(id);
    if (!service) return buildResponse(DataConstant.NOT_FOUND, DataConstant.RECORD_NOT_FOUND);

    if (service.status === status) {
      if (status === DataConstant.SHORT_ONE) return buildResponse(DataConstant.BAD_REQUEST, "Service already active");
      if (status === DataConstant.SHORT_TWO) return buildResponse(DataConstant.BAD_REQUEST, "Service already inactive");
      if (status === DataConstant.SHORT_ZERO) return buildResponse(DataConstant.BAD_REQUEST, "Service already deleted");
    }

    service.status = status;
    service.updatedAt = new Date();
    await service.save();

    let message = DataConstant.INVALID_REQUEST;
    if (status === DataConstant.SHORT_ZERO) message = "Service deleted successfully";
    if (status === DataConstant.SHORT_ONE) message = "Service activated successfully";
    if (status === DataConstant.SHORT_TWO) message = "Service deactivated successfully";

    return buildResponse(DataConstant.OK, message, buildOurServiceResponse(service));
  } catch (err) {
    logger.error(`blockUnblockService error: ${err.message}`, { stack: err.stack });
    return buildResponse(DataConstant.SERVER_ERROR, DataConstant.SERVER_MESSAGE);
  }
}

module.exports = { addService, getService, getAllServices, blockUnblockService };
