const logger = require("../utils/logger");
const buildResponse = require("../utils/response");
const enquiryRepo = require("../repositories/EnquiryRepository");
const { buildEnquiryResponse } = require("../utils/ResponseBuilder");

const DataConstant = {
  OK: 200,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  SHORT_ONE: 1,
  SHORT_TWO: 2,
  RECORD_FOUND: "Record found",
  RECORD_NOT_FOUND: "No records found",
  SERVER_MESSAGE: "Internal Server Error",
};

async function addEnquiry(data) {
  try {
    if (!data) return buildResponse(400, "Invalid request: no data provided", null);
    const enquiry = await enquiryRepo.createEnquiry(data);
    logger.info(`Created new enquiry with id=${enquiry._id}`);
    return buildResponse(201, "Enquiry submitted successfully", buildEnquiryResponse(enquiry));
  } catch (err) {
    logger.error(`addEnquiry error: ${err.message}`, { stack: err.stack });
    return buildResponse(500, err.message, null);
  }
}

async function getEnquiry(id) {
  try {
    const enquiry = await enquiryRepo.findById(id);
    if (!enquiry) return buildResponse(404, "Enquiry not found", null);
    return buildResponse(200, "Enquiry fetched successfully", buildEnquiryResponse(enquiry));
  } catch (err) {
    logger.error(`getEnquiry error: ${err.message}`, { stack: err.stack });
    return buildResponse(500, err.message, null);
  }
}

async function getAllEnquiries(pageIndex, pageSize, status, searchText) {
  try {
    let query = { status: { $in: [DataConstant.SHORT_ONE, DataConstant.SHORT_TWO] } };

    if (status !== undefined && status !== null && status !== "") {
      const parsedStatus = parseInt(status, 10);
      if (!isNaN(parsedStatus)) query.status = parsedStatus;
    }

    if (searchText && searchText.trim() !== "") {
      query.$or = [
        { name: { $regex: searchText.trim(), $options: "i" } },
        { email: { $regex: searchText.trim(), $options: "i" } },
        { projectType: { $regex: searchText.trim(), $options: "i" } },
      ];
    }

    const skip = pageIndex * pageSize;
    const [data, total] = await Promise.all([
      enquiryRepo.findAll(query, skip, pageSize),
      enquiryRepo.countDocuments(query),
    ]);

    if (!data.length) return buildResponse(DataConstant.NOT_FOUND, DataConstant.RECORD_NOT_FOUND);

    return buildResponse(DataConstant.OK, DataConstant.RECORD_FOUND, {
      content: data.map(buildEnquiryResponse),
      pageIndex,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
      hasNext: skip + data.length < total,
      hasPrevious: pageIndex > 0,
    });
  } catch (err) {
    logger.error(`getAllEnquiries error: ${err.message}`, { stack: err.stack });
    return buildResponse(DataConstant.SERVER_ERROR, DataConstant.SERVER_MESSAGE);
  }
}

module.exports = { addEnquiry, getEnquiry, getAllEnquiries };
