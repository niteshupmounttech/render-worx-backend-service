const express = require("express");
const router = express.Router();
const multer = require("multer");
const ctrl = require("../controllers/OurServiceController");

const upload = multer({ storage: multer.memoryStorage() });

/**
 * @openapi
 * /admin/services/addService:
 *   post:
 *     tags: [Our Services Controller]
 *     summary: Create or update a service
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: Pass to update existing service
 *               title:
 *                 type: string
 *               subTitle:
 *                 type: string
 *               shortDescriptions:
 *                 type: string
 *               fullDescriptions:
 *                 type: string
 *               serviceOffered:
 *                 type: array
 *                 items:
 *                   type: string
 *               icon:
 *                 type: string
 *                 format: binary
 *               thumbnailFile:
 *                 type: string
 *                 format: binary
 *               galleryFiles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Service updated successfully
 *       201:
 *         description: Service created successfully
 *       500:
 *         description: Internal server error
 */
router.post(
  "/addService",
  upload.fields([
    { name: "icon", maxCount: 1 },
    { name: "thumbnailFile", maxCount: 1 },
    { name: "galleryFiles", maxCount: 20 },
  ]),
  ctrl.addService
);

/**
 * @openapi
 * /admin/services/getService/{id}:
 *   get:
 *     tags: [Our Services Controller]
 *     summary: Get service by ID
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
 *         description: Service fetched successfully
 *       404:
 *         description: Service not found
 *       500:
 *         description: Internal server error
 */
router.get("/getService/:id", ctrl.getService);

/**
 * @openapi
 * /admin/services/getAllServices:
 *   get:
 *     tags: [Our Services Controller]
 *     summary: Get all services with pagination and filters
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
router.get("/getAllServices", ctrl.getAllServices);

/**
 * @openapi
 * /admin/services/blockUnblock:
 *   post:
 *     tags: [Our Services Controller]
 *     summary: Activate, deactivate or delete a service
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
 *         description: Service status updated
 *       404:
 *         description: Service not found
 *       500:
 *         description: Internal server error
 */
router.post("/blockUnblock", ctrl.blockUnblockService);

module.exports = router;
