const logger = require("../utils/logger");
const buildResponse = require("../utils/response");
const ContactInfo = require("../models/ContactInfo");
const { buildContactInfoResponse } = require("../utils/ResponseBuilder");

async function getContactInfo() {
  try {
    const contact = await ContactInfo.findOne();
    if (!contact) return buildResponse(404, "Contact info not found", null);
    return buildResponse(200, "Contact info fetched successfully", buildContactInfoResponse(contact));
  } catch (err) {
    logger.error(`getContactInfo error: ${err.message}`, { stack: err.stack });
    return buildResponse(500, err.message, null);
  }
}

async function updateContactInfo(email, mobile, address) {
  try {
    const updated = await ContactInfo.findOneAndUpdate(
      {},
      { $set: { email: email || "", mobile: mobile || "", address: address || "" } },
      { new: true, upsert: true }
    );
    return buildResponse(200, "Contact info updated successfully", buildContactInfoResponse(updated));
  } catch (err) {
    logger.error(`updateContactInfo error: ${err.message}`, { stack: err.stack });
    return buildResponse(500, err.message, null);
  }
}

module.exports = { getContactInfo, updateContactInfo };
