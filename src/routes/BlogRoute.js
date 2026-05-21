const express = require("express");
const router = express.Router();
const multer = require("multer");
const ctrl = require("../controllers/BlogController");

const upload = multer({ storage: multer.memoryStorage() });

/**
 * @openapi
 * /admin/blog/addBlog:
 *   post:
 *     tags: [Blog Controller]
 *     summary: Create or update a blog
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
 *                 description: Pass to update existing blog
 *               title:
 *                 type: string
 *               writtenBy:
 *                 type: string
 *               difficulty:
 *                 type: string
 *               topic:
 *                 type: string
 *               content:
 *                 type: string
 *               mediaFiles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *       201:
 *         description: Blog created successfully
 *       500:
 *         description: Internal server error
 */
router.post(
  "/addBlog",
  upload.fields([{ name: "mediaFiles", maxCount: 20 }]),
  ctrl.addBlog
);

/**
 * @openapi
 * /admin/blog/getBlog/{id}:
 *   get:
 *     tags: [Blog Controller]
 *     summary: Get blog by ID
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
 *         description: Blog fetched successfully
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Internal server error
 */
router.get("/getBlog/:id", ctrl.getBlog);

/**
 * @openapi
 * /admin/blog/getAllBlogs:
 *   get:
 *     tags: [Blog Controller]
 *     summary: Get all blogs with pagination and filters
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
router.get("/getAllBlogs", ctrl.getAllBlogs);

/**
 * @openapi
 * /admin/blog/blockUnblock:
 *   post:
 *     tags: [Blog Controller]
 *     summary: Activate, deactivate or delete a blog
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
 *         description: Blog status updated
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Internal server error
 */
router.post("/blockUnblock", ctrl.blockUnblockBlog);

module.exports = router;
