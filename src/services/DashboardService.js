const logger = require("../utils/logger");
const buildResponse = require("../utils/response");
const Portfolio = require("../models/Portfolio");
const AdminUser = require("../models/AdminUser");
const OurService = require("../models/OurService");
const Enquiry = require("../models/Enquiry");

async function getDashboard() {
  try {
    const [totalPortfolio, totalAdminUsers, totalServices, totalEnquiries] = await Promise.all([
      Portfolio.countDocuments({ status: 1 }),
      AdminUser.countDocuments({ status: 1 }),
      OurService.countDocuments({ status: 1 }),
      Enquiry.countDocuments({ status: 1 }),
    ]);

    return buildResponse(200, "Dashboard data fetched successfully", {
      totalPortfolio,
      totalAdminUsers,
      totalServices,
      totalEnquiries,
    });
  } catch (err) {
    logger.error(`getDashboard error: ${err.message}`, { stack: err.stack });
    return buildResponse(500, err.message, null);
  }
}

module.exports = { getDashboard };
