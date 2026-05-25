const dashboardService = require("../services/DashboardService");
const buildResponse = require("../utils/response");
const logger = require("../utils/logger");

exports.getDashboard = async (req, res) => {
  try {
    const result = await dashboardService.getDashboard();
    res.status(200).json(result);
  } catch (err) {
    logger.error("❌ getDashboard controller error", { error: err });
    res.status(500).json(buildResponse(500, err.message, null));
  }
};
