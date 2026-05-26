const express = require("express");
const router = express.Router();
const multer = require("multer");
const ctrl = require("../controllers/AboutUsController");

const upload = multer({ storage: multer.memoryStorage() });

/**
 * @openapi
 * /admin/about/getAboutUs:
 *   get:
 *     tags: [About Us Controller]
 *     summary: Get About Us content
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Record found
 *       404:
 *         description: About Us not found
 *       500:
 *         description: Internal server error
 */
router.get("/getAboutUs", ctrl.getAboutUs);

/**
 * @openapi
 * /admin/about/updateAboutUs:
 *   post:
 *     tags: [About Us Controller]
 *     summary: Create or update About Us content
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               mainTitle:
 *                 type: string
 *               mainDescription:
 *                 type: string
 *               mission:
 *                 type: string
 *               vision:
 *                 type: string
 *               aboutImage:
 *                 type: string
 *                 format: binary
 *               statPoints:
 *                 type: string
 *                 description: JSON array of { value, label }
 *               advantagePoints:
 *                 type: string
 *                 description: JSON array of { title, description }
 *               workSteps:
 *                 type: string
 *                 description: JSON array of { step, icon, title, description }
 *               clientStories:
 *                 type: string
 *                 description: JSON array of { quote, name, title }
 *               teamMembers:
 *                 type: string
 *                 description: JSON array of { name, designation, bio, image, order }
 *     responses:
 *       200:
 *         description: About Us updated successfully
 *       500:
 *         description: Internal server error
 */
router.post("/updateAboutUs", upload.fields([{ name: "aboutImage", maxCount: 1 }]), ctrl.updateAboutUs);

module.exports = router;
