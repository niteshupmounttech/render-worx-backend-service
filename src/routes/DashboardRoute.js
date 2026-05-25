const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/DashboardController");

/**
 * @openapi
 * /admin/dashboard/getDashboard:
 *   get:
 *     tags: [Dashboard Controller]
 *     summary: Get dashboard counts for Portfolio, AdminUsers, Services and Enquiries
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPortfolio:
 *                   type: integer
 *                 totalAdminUsers:
 *                   type: integer
 *                 totalServices:
 *                   type: integer
 *                 totalEnquiries:
 *                   type: integer
 *       500:
 *         description: Internal server error
 */
router.get("/getDashboard", ctrl.getDashboard);

module.exports = router;
