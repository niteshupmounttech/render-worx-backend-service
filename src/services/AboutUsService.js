const logger = require("../utils/logger");
const buildResponse = require("../utils/response");
const fileUtil = require("../utils/FileUtil");
const AboutUs = require("../models/AboutUs");
const { buildAboutUsResponse } = require("../utils/ResponseBuilder");

async function getAboutUs() {
  try {
    const about = await AboutUs.findOne();
    if (!about) return buildResponse(404, "About Us not found", null);
    return buildResponse(200, "Record found", buildAboutUsResponse(about));
  } catch (err) {
    logger.error(`getAboutUs error: ${err.message}`, { stack: err.stack });
    return buildResponse(500, err.message, null);
  }
}

async function updateAboutUs(data) {
  try {
    if (!data) return buildResponse(400, "Invalid request: no data provided", null);

    // Upload aboutImage if it's a file object
    let aboutImageUrl = data.aboutImage && typeof data.aboutImage === "object"
      ? await fileUtil.uploadFile(data.aboutImage, "about").catch(() => null)
      : data.aboutImage || "";

    // Upload team member images if file objects
    let teamMembers = data.teamMembers || [];
    if (teamMembers.length > 0) {
      teamMembers = await Promise.all(
        teamMembers.map(async (member) => {
          if (member.image && typeof member.image === "object") {
            member.image = await fileUtil.uploadFile(member.image, "about").catch(() => member.image);
          }
          return member;
        })
      );
    }

    // Upload workStep icons if file objects
    let workSteps = data.workSteps || [];
    if (workSteps.length > 0) {
      workSteps = await Promise.all(
        workSteps.map(async (step) => {
          if (step.icon && typeof step.icon === "object") {
            step.icon = await fileUtil.uploadFile(step.icon, "about").catch(() => step.icon);
          }
          return step;
        })
      );
    }

    const updates = {
      ...data,
      aboutImage: aboutImageUrl,
      teamMembers,
      workSteps,
      updatedAt: new Date(),
    };

    const about = await AboutUs.findOneAndUpdate({}, { $set: updates }, { new: true, upsert: true });
    return buildResponse(200, "About Us updated successfully", buildAboutUsResponse(about));
  } catch (err) {
    logger.error(`updateAboutUs error: ${err.message}`, { stack: err.stack });
    return buildResponse(500, err.message, null);
  }
}

module.exports = { getAboutUs, updateAboutUs };
