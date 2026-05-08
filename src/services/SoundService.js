const logger = require("../utils/logger");
const buildResponse = require("../utils/response");
const fileUtil = require("../utils/FileUtil");
const soundRepo = require("../repositories/SoundRepository");
const  { buildSoundResponse } = require("../utils/ResponseBuilder");
const Sound = require("../models/Sound");



const DataConstant = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  NO_CONTENT: 204,
  SERVER_ERROR: 500,

  SHORT_ZERO: 0,
  SHORT_ONE: 1,
  SHORT_TWO: 2,

  ROLE_CREATED: "Role created successfully",
  ROLE_UPDATED: "Role updated successfully",
  ROLE_DELETED: "Role deleted successfully",
  ROLE_ACTIVE: "Role activated successfully",
  ROLE_INACTIVE: "Role inactivated successfully",
  ROLE_NOT_FOUND: "Role not found",
  ROLE_MODULE_NOT_FOUND: "RoleModule not found",
  MODULE_NOT_FOUND: "Module not found",
  ROLE_BAD_REQUEST: "Invalid Role request",
  RECORD_FOUND: "Record found",
  RECORD_NOT_FOUND: "No records found",
  PAGINATION_REQUIRED: "Pagination params are required",
  SERVER_MESSAGE: "Internal Server Error",
  ROLE_ALREADY_ACTIVE: "Role is already active",
  ROLE_ALREADY_INACTIVE: "Role is already inactive",
  INVALID_REQUEST: "Invalid request"
};



async function addSound(data) {
  try {
    if (!data) {
      logger.error("addSound: No data provided");
      return buildResponse(400, "Invalid request: no data provided", null);
    }

    logger.info(`addSound: soundId=${data.id || "NEW_SOUND"}`);

    let soundUrl = null;

    // Upload sound file if present
    if (data.soundFile) {
      try {
        soundUrl = await fileUtil.uploadFile(data.soundFile);
        logger.info(`🔊 Uploaded sound file: ${soundUrl}`);
      } catch (err) {
        logger.error("❌ Failed to upload sound file", { error: err });
      }
    }

    const safeUpdates = {
      ...data,
      soundUrl: soundUrl || data.soundUrl,
      updatedAt: new Date(),
    };

    let sound;

    // Create new sound
    if (!data.id || data.id.trim() === "") {
      sound = await soundRepo.createSound(safeUpdates);
      logger.info(`Created new sound with id=${sound._id}`);

      return buildResponse(201, "Sound created successfully", buildSoundResponse(sound));
    }

    // Update existing sound
    sound = await soundRepo.updateSound(data.id, safeUpdates);

    if (!sound) {
      logger.warn(`addSound: Sound not found id=${data.id}`);
      return buildResponse(404, "Sound not found", null);
    }

    return buildResponse(200, "Sound updated successfully", buildSoundResponse(sound));

  } catch (err) {
    logger.error(`addSound error: ${err.message}`, { stack: err.stack });
    return buildResponse(500, err.message, null);
  }
}




// ======================================================
// ✅ Get All Sounds (Pagination, Filters, Search)
// ======================================================
async function getAllSound(pageIndex, pageSize, status, searchText) {
  try {

    let query = {
      status: { $in: [DataConstant.SHORT_ONE, DataConstant.SHORT_TWO] }
    };

    // Convert status to integer if provided
    if (status !== undefined && status !== null && status !== "") {
      const parsedStatus = parseInt(status, 10);
      if (!isNaN(parsedStatus)) {
        query.status = parsedStatus;
      }
    }

    // Search by soundUrl (contains)
    if (searchText && searchText.trim() !== "") {
      query.title = { $regex: searchText.trim(), $options: "i" };
    }

    const skip = pageIndex * pageSize;

    const [data, total] = await Promise.all([
      Sound.find(query).sort({ createdAt: -1 }).skip(skip).limit(pageSize),
      Sound.countDocuments(query)
    ]);

    
    let query2 = { status: 1 };
    const totalActive = await Sound.countDocuments(query2);

    query2 = { status: 2 };
    const totalInActive = await Sound.countDocuments(query2);


    if (!data.length) {
      return buildResponse(DataConstant.NOT_FOUND, DataConstant.RECORD_NOT_FOUND);
    }

    return buildResponse(DataConstant.OK, DataConstant.RECORD_FOUND, {
      content: data.map(buildSoundResponse),
      pageIndex,
      pageSize,
      total,
      totalActive,
      totalInActive,
      totalPages: Math.ceil(total / pageSize),
      hasNext: skip + data.length < total,
      hasPrevious: pageIndex > 0
    });

  } catch (err) {
    logger.error("Error in getAllSound: %s", err.stack || err.message);
    return buildResponse(DataConstant.SERVER_ERROR, DataConstant.SERVER_MESSAGE);
  }
}



// ======================================================
// ✅ Block / Unblock / Delete Sound
// ======================================================
async function blockUnblockSound(soundId, status) {
  try {
    const sound = await Sound.findById(soundId);

    if (!sound) {
      return buildResponse(DataConstant.NOT_FOUND, DataConstant.RECORD_NOT_FOUND);
    }

    // If already same status
    if (sound.status === status) {
      if (status === DataConstant.SHORT_ONE) {
        return buildResponse(DataConstant.BAD_REQUEST, "Sound already active");
      }
      if (status === DataConstant.SHORT_TWO) {
        return buildResponse(DataConstant.BAD_REQUEST, "Sound already inactive");
      }
      if (status === DataConstant.SHORT_ZERO) {
        return buildResponse(DataConstant.BAD_REQUEST, "Sound already deleted");
      }
    }

    // Update status
    sound.status = status;
    sound.updatedAt = new Date();
    await sound.save();

    let message = DataConstant.INVALID_REQUEST;
    if (status === DataConstant.SHORT_ZERO) message = "Sound deleted successfully";
    if (status === DataConstant.SHORT_ONE) message = "Sound activated successfully";
    if (status === DataConstant.SHORT_TWO) message = "Sound deactivated successfully";

    return buildResponse(DataConstant.OK, message, buildSoundResponse(sound));

  } catch (err) {
    logger.error("Error in blockUnblockSound: %s", err.stack || err.message);
    return buildResponse(DataConstant.SERVER_ERROR, DataConstant.SERVER_MESSAGE);
  }
}






module.exports = { addSound,getAllSound,
  blockUnblockSound };
