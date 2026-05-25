const logger = require("../utils/logger");
const buildResponse = require("../utils/response");
const fileUtil = require("../utils/FileUtil");
const blogRepo = require("../repositories/BlogRepository");
const { buildBlogResponse } = require("../utils/ResponseBuilder");

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

async function addBlog(data) {
  try {
    if (!data) return buildResponse(400, "Invalid request: no data provided", null);

    logger.info(`addBlog: id=${data.id || "NEW"}`);

    // Upload thumbnail file
    let thumbnailUrl = data.thumbnailFile && typeof data.thumbnailFile === "object"
      ? await fileUtil.uploadFile(data.thumbnailFile, "blog").catch(() => null)
      : data.thumbnailFile || "";

    // Upload media files
    let mediaUrls = [];
    if (data.mediaFiles && data.mediaFiles.length > 0) {
      for (const file of data.mediaFiles) {
        try {
          const url = await fileUtil.uploadFile(file, "blog");
          mediaUrls.push(url);
        } catch (err) {
          logger.error("❌ Failed to upload media file", { error: err });
        }
      }
    }

    const safeUpdates = {
      ...data,
      thumbnailFile: thumbnailUrl,
      mediaFiles: mediaUrls.length > 0 ? mediaUrls : data.mediaFiles,
      updatedAt: new Date(),
    };

    let blog;

    if (!data.id || data.id.trim() === "") {
      blog = await blogRepo.createBlog(safeUpdates);
      logger.info(`Created new blog with id=${blog._id}`);
      return buildResponse(201, "Blog created successfully", buildBlogResponse(blog));
    }

    blog = await blogRepo.updateBlog(data.id, safeUpdates);
    if (!blog) return buildResponse(404, "Blog not found", null);

    return buildResponse(200, "Blog updated successfully", buildBlogResponse(blog));
  } catch (err) {
    logger.error(`addBlog error: ${err.message}`, { stack: err.stack });
    return buildResponse(500, err.message, null);
  }
}

async function getBlog(id) {
  try {
    const blog = await blogRepo.findById(id);
    if (!blog) return buildResponse(404, "Blog not found", null);
    return buildResponse(200, "Blog fetched successfully", buildBlogResponse(blog));
  } catch (err) {
    logger.error(`getBlog error: ${err.message}`, { stack: err.stack });
    return buildResponse(500, err.message, null);
  }
}

async function getAllBlogs(pageIndex, pageSize, status, searchText) {
  try {
    let query = { status: { $in: [DataConstant.SHORT_ONE, DataConstant.SHORT_TWO] } };

    if (status !== undefined && status !== null && status !== "") {
      const parsedStatus = parseInt(status, 10);
      if (!isNaN(parsedStatus)) query.status = parsedStatus;
    }

    if (searchText && searchText.trim() !== "") {
      query.$or = [
        { title: { $regex: searchText.trim(), $options: "i" } },
        { writtenBy: { $regex: searchText.trim(), $options: "i" } },
        { topic: { $regex: searchText.trim(), $options: "i" } },
      ];
    }

    const skip = pageIndex * pageSize;
    const [data, total] = await Promise.all([
      blogRepo.findAll(query, skip, pageSize),
      blogRepo.countDocuments(query),
    ]);

    const totalActive = await blogRepo.countDocuments({ status: 1 });
    const totalInActive = await blogRepo.countDocuments({ status: 2 });

    if (!data.length) return buildResponse(DataConstant.NOT_FOUND, DataConstant.RECORD_NOT_FOUND);

    return buildResponse(DataConstant.OK, DataConstant.RECORD_FOUND, {
      content: data.map(buildBlogResponse),
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
    logger.error(`getAllBlogs error: ${err.message}`, { stack: err.stack });
    return buildResponse(DataConstant.SERVER_ERROR, DataConstant.SERVER_MESSAGE);
  }
}

async function blockUnblockBlog(id, status) {
  try {
    const blog = await blogRepo.findById(id);
    if (!blog) return buildResponse(DataConstant.NOT_FOUND, DataConstant.RECORD_NOT_FOUND);

    if (blog.status === status) {
      if (status === DataConstant.SHORT_ONE) return buildResponse(DataConstant.BAD_REQUEST, "Blog already active");
      if (status === DataConstant.SHORT_TWO) return buildResponse(DataConstant.BAD_REQUEST, "Blog already inactive");
      if (status === DataConstant.SHORT_ZERO) return buildResponse(DataConstant.BAD_REQUEST, "Blog already deleted");
    }

    blog.status = status;
    blog.updatedAt = new Date();
    await blog.save();

    let message = DataConstant.INVALID_REQUEST;
    if (status === DataConstant.SHORT_ZERO) message = "Blog deleted successfully";
    if (status === DataConstant.SHORT_ONE) message = "Blog activated successfully";
    if (status === DataConstant.SHORT_TWO) message = "Blog deactivated successfully";

    return buildResponse(DataConstant.OK, message, buildBlogResponse(blog));
  } catch (err) {
    logger.error(`blockUnblockBlog error: ${err.message}`, { stack: err.stack });
    return buildResponse(DataConstant.SERVER_ERROR, DataConstant.SERVER_MESSAGE);
  }
}

module.exports = { addBlog, getBlog, getAllBlogs, blockUnblockBlog };
