const aboutUsService = require("../services/AboutUsService");
const buildResponse = require("../utils/response");
const logger = require("../utils/logger");

exports.getAboutUs = async (req, res) => {
  try {
    const result = await aboutUsService.getAboutUs();
    res.status(200).json(result);
  } catch (err) {
    logger.error("❌ getAboutUs controller error", { error: err });
    res.status(500).json(buildResponse(500, err.message, null));
  }
};

exports.updateAboutUs = async (req, res) => {
  try {
    const data = {
      ...req.body,
      aboutImage: req.files?.aboutImage?.[0] || req.body.aboutImage || null,
    };

    // Parse JSON string arrays from multipart form
    ["statPoints", "advantagePoints", "workSteps", "clientStories", "teamMembers"].forEach((key) => {
      if (data[key] && typeof data[key] === "string") {
        try { data[key] = JSON.parse(data[key]); } catch (_) {}
      }
    });

    const result = await aboutUsService.updateAboutUs(data);
    res.status(200).json(result);
  } catch (err) {
    logger.error("❌ updateAboutUs controller error", { error: err });
    res.status(500).json(buildResponse(500, err.message, null));
  }
};
