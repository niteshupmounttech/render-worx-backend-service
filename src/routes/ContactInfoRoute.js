const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/ContactInfoController");

/**
 * @openapi
 * /admin/contact/getContactInfo:
 *   get:
 *     tags: [Contact Info Controller]
 *     summary: Get contact info
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contact info fetched successfully
 *       404:
 *         description: Contact info not found
 *       500:
 *         description: Internal server error
 */
router.get("/getContactInfo", ctrl.getContactInfo);

/**
 * @openapi
 * /admin/contact/updateContactInfo:
 *   post:
 *     tags: [Contact Info Controller]
 *     summary: Create or update contact info
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "contact@example.com"
 *               mobile:
 *                 type: string
 *                 example: "+91 9876543210"
 *               address:
 *                 type: string
 *                 example: "123 Street, City, Country"
 *     responses:
 *       200:
 *         description: Contact info updated successfully
 *       500:
 *         description: Internal server error
 */
router.post("/updateContactInfo", ctrl.updateContactInfo);

module.exports = router;
