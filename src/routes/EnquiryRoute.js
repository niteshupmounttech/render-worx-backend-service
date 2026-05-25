const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/EnquiryController");

/**
 * @openapi
 * /admin/enquiry/addEnquiry:
 *   post:
 *     tags: [Enquiry Controller]
 *     summary: Submit a new enquiry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               projectType:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Enquiry submitted successfully
 *       500:
 *         description: Internal server error
 */
router.post("/addEnquiry", ctrl.addEnquiry);

/**
 * @openapi
 * /admin/enquiry/getEnquiry/{id}:
 *   get:
 *     tags: [Enquiry Controller]
 *     summary: Get enquiry by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Enquiry fetched successfully
 *       404:
 *         description: Enquiry not found
 *       500:
 *         description: Internal server error
 */
router.get("/getEnquiry/:id", ctrl.getEnquiry);

/**
 * @openapi
 * /admin/enquiry/getAllEnquiries:
 *   get:
 *     tags: [Enquiry Controller]
 *     summary: Get all enquiries with pagination and filters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: pageIndex
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *       - in: query
 *         name: searchText
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Records fetched successfully
 *       404:
 *         description: No records found
 *       500:
 *         description: Internal server error
 */
router.get("/getAllEnquiries", ctrl.getAllEnquiries);

module.exports = router;
