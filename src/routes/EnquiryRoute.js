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
 *               read:
 *                 type: boolean
 *                 default: false
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

/**
 * @openapi
 * /admin/enquiry/readEnquiry:
 *   post:
 *     tags: [Enquiry Controller]
 *     summary: Mark an enquiry as read or unread
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - read
 *             properties:
 *               id:
 *                 type: string
 *               read:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Enquiry read status updated
 *       404:
 *         description: Enquiry not found
 *       500:
 *         description: Internal server error
 */
router.post("/readEnquiry", ctrl.readEnquiry);

/**
 * @openapi
 * /admin/enquiry/blockUnblock:
 *   post:
 *     tags: [Enquiry Controller]
 *     summary: Activate, deactivate or delete an enquiry
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - status
 *             properties:
 *               id:
 *                 type: string
 *               status:
 *                 type: integer
 *                 description: "0 = delete, 1 = active, 2 = inactive"
 *                 example: 1
 *     responses:
 *       200:
 *         description: Enquiry status updated
 *       404:
 *         description: Enquiry not found
 *       500:
 *         description: Internal server error
 */
router.post("/blockUnblock", ctrl.blockUnblockEnquiry);

module.exports = router;
