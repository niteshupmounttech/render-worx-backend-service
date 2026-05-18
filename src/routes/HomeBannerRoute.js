const express = require("express");
const router = express.Router();
const multer = require("multer");
const ctrl = require("../controllers/HomeBannerController");

const upload = multer({ storage: multer.memoryStorage() });

/**
 * @openapi
 * /admin/home/getBanner:
 *   get:
 *     tags: [Home Banner Controller]
 *     summary: Get home page banner (image & video)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Home banner fetched successfully
 *       404:
 *         description: Home banner not found
 *       500:
 *         description: Internal server error
 */
router.get("/getBanner", ctrl.getHomeBanner);

/**
 * @openapi
 * /admin/home/updateBanner:
 *   post:
 *     tags: [Home Banner Controller]
 *     summary: Create or update home page banner
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *             properties:
 *               mediaFile:
 *                 type: string
 *                 format: binary
 *               type:
 *                 type: string
 *                 enum: [image, video]
 *                 example: image
 *     responses:
 *       200:
 *         description: Home banner updated successfully
 *       500:
 *         description: Internal server error
 */
router.post("/updateBanner", upload.fields([{ name: "mediaFile", maxCount: 1 }]), ctrl.updateHomeBanner);

module.exports = router;
