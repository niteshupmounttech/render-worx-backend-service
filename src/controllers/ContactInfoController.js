const contactInfoService = require("../services/ContactInfoService");
const buildResponse = require("../utils/response");
const logger = require("../utils/logger");

exports.getContactInfo = async (req, res) => {
  try {
    const result = await contactInfoService.getContactInfo();
    res.status(200).json(result);
  } catch (err) {
    logger.error("❌ getContactInfo controller error", { error: err });
    res.status(500).json(buildResponse(500, err.message, null));
  }
};

exports.updateContactInfo = async (req, res) => {
  try {
    const { email, mobile, address } = req.body;
    const result = await contactInfoService.updateContactInfo(email, mobile, address);
    res.status(200).json(result);
  } catch (err) {
    logger.error("❌ updateContactInfo controller error", { error: err });
    res.status(500).json(buildResponse(500, err.message, null));
  }
};
