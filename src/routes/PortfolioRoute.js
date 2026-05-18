const express = require("express");
const router = express.Router();
const multer = require("multer");
const ctrl = require("../controllers/PortfolioController");

const upload = multer({ storage: multer.memoryStorage() });

/**
 * @openapi
 * /admin/portfolio/addPortfolio:
 *   post:
 *     tags: [Portfolio Controller]
 *     summary: Create or update a portfolio
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
 *                 description: Pass to update existing portfolio
 *               category:
 *                 type: string
 *               year:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *               location:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               fullDescription:
 *                 type: string
 *               status:
 *                 type: integer
 *                 example: 1
 *               featured:
 *                 type: boolean
 *                 example: false
 *               clientName:
 *                 type: string
 *               surfaceArea:
 *                 type: string
 *               scope:
 *                 type: string
 *               softwareUsed:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
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
 *         description: Portfolio updated successfully
 *       201:
 *         description: Portfolio created successfully
 *       500:
 *         description: Internal server error
 */
router.post(
  "/addPortfolio",
  upload.fields([
    { name: "thumbnailFile", maxCount: 1 },
    { name: "galleryFiles", maxCount: 20 },
  ]),
  ctrl.addPortfolio
);

/**
 * @openapi
 * /admin/portfolio/getAllPortfolios:
 *   get:
 *     tags: [Portfolio Controller]
 *     summary: Get all portfolios with pagination and filters
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
router.get("/getAllPortfolios", ctrl.getAllPortfolios);

/**
 * @openapi
 * /admin/portfolio/blockUnblock:
 *   post:
 *     tags: [Portfolio Controller]
 *     summary: Activate, deactivate or delete a portfolio
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
 *         description: Portfolio status updated
 *       404:
 *         description: Portfolio not found
 *       500:
 *         description: Internal server error
 */
/**
 * @openapi
 * /admin/portfolio/getPortfolio/{id}:
 *   get:
 *     tags: [Portfolio Controller]
 *     summary: Get portfolio by ID
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
 *         description: Portfolio fetched successfully
 *       404:
 *         description: Portfolio not found
 *       500:
 *         description: Internal server error
 */
router.get("/getPortfolio/:id", ctrl.getPortfolio);

router.post("/blockUnblock", ctrl.blockUnblockPortfolio);

/**
 * @openapi
 * /admin/portfolio/updateFeatured:
 *   post:
 *     tags: [Portfolio Controller]
 *     summary: Enable or disable featured for a portfolio (max 12 featured allowed)
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
 *               - featured
 *             properties:
 *               id:
 *                 type: string
 *               featured:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Portfolio featured updated
 *       400:
 *         description: Maximum 12 portfolios can be featured at a time
 *       404:
 *         description: Portfolio not found
 *       500:
 *         description: Internal server error
 */
router.post("/updateFeatured", ctrl.updateFeatured);

/**
 * @openapi
 * /admin/portfolio/getPortfoliosByCategory:
 *   get:
 *     tags: [Portfolio Controller]
 *     summary: Get featured active portfolios, optionally filtered by category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by category. If omitted, returns all featured active portfolios
 *     responses:
 *       200:
 *         description: Records fetched successfully
 *       404:
 *         description: No records found
 *       500:
 *         description: Internal server error
 */
router.get("/getPortfoliosByCategory", ctrl.getPortfoliosByCategory);

module.exports = router;
