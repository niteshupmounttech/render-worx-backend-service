// routes/locationRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const locationController = require("../controllers/LocationController");

/**
 * @swagger
 * tags:
 *   name: Location Controller
 *   description: Country and City management
 */

// /**
//  * @swagger
//  * /admin/location/{countryCode}:
//  *   get:
//  *     summary: Get all cities by country code
//  *     tags: [Location Controller]
//  *     parameters:
//  *       - in: path
//  *         name: countryCode
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: Country code (e.g., IN, US)
//  *     responses:
//  *       200:
//  *         description: List of cities
//  */
// router.get("/:countryCode", locationController.getCities);

/**
 * @swagger
 * /admin/location/uploadCityFile:
 *   post:
 *     summary: Upload an Excel file to add multiple cities
 *     tags: [Location Controller]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               countryId:
 *                 type: string
 *                 description: Country ID
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded and cities added
 */
router.post("/uploadCityFile", upload.single("file"), locationController.uploadCityFile);

/**
 * @swagger
 * /admin/location/addCountry:
 *   post:
 *     summary: Add or update a country
 *     tags: [Location Controller]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: Optional. Provide ID to update existing country
 *               countryName:
 *                 type: string
 *                 description: Name of the country
 *               countryCode:
 *                 type: string
 *                 description: ISO country code
 *               countryShortCode:
 *                 type: string
 *                 description: Short code of country
 *               currencyCode:
 *                 type: string
 *                 description: Currency code
 *               currencySymbol:
 *                 type: string
 *                 description: Currency symbol
 *     responses:
 *       201:
 *         description: Country created successfully
 *       200:
 *         description: Country updated successfully
 *       400:
 *         description: Bad request
 */
router.post("/addCountry", locationController.addCountry);

/**
 * @openapi
 * /admin/location/getAllCountry:
 *   get:
 *     tags: [Location Controller]
 *     summary: Get list of all country (with pagination & search, sorted by createdAt DESC)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: pageIndex
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Page index (starting from 0)
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records per page
 *       - in: query
 *         name: searchText
 *         schema:
 *           type: string
 *         description: Search text for filtering admin (name, email, etc.)
 *     responses:
 *       200:
 *         description: List of admin
 *       401:
 *         description: Unauthorized
 */
router.get("/getAllCountry", locationController.getAllCountry);

/**
 * @swagger
 * /admin/location/addCity:
 *   post:
 *     summary: Add or update a city
 *     tags: [Location Controller]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: Optional. Provide ID to update existing city
 *               countryId:
 *                 type: string
 *                 description: Country ID
 *               cityName:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               cityImageFile:
 *                 type: string
 *                 format: binary
 *               cityIconFile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: City created successfully
 *       200:
 *         description: City updated successfully
 *       400:
 *         description: Bad request
 */
router.post(
  "/addCity",
  upload.fields([
    { name: "cityImageFile", maxCount: 1 },
    { name: "cityIconFile", maxCount: 1 },
  ]),
  locationController.addCity
);


/**
 * @swagger
 * /admin/location/blockUnblockCountry:
 *   post:
 *     summary: Block or unblock a country
 *     tags: [Location Controller]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               status:
 *                 type: number
 *                 enum: [0, 1]
 *                 description: 0 = Block, 1 = Unblock
 *     responses:
 *       200:
 *         description: Country status updated
 */
router.post("/blockUnblockCountry", locationController.blockUnblockCountry);

/**
 * @swagger
 * /admin/location/blockUnblockCity:
 *   post:
 *     summary: Block or unblock a city
 *     tags: [Location Controller]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               status:
 *                 type: number
 *                 enum: [0, 1]
 *                 description: 0 = Block, 1 = Unblock
 *     responses:
 *       200:
 *         description: City status updated
 */
router.post("/blockUnblockCity", locationController.blockUnblockCity);

// /**
//  * @swagger
//  * /admin/location/getAllCity:
//  *   get:
//  *     summary: Get all cities
//  *     tags: [Location Controller]
//  *     responses:
//  *       200:
//  *         description: List of all cities
//  */
// router.get("/getAllCity", locationController.getAllCity);

/**
 * @swagger
 * /admin/location/getAllCountryForAdmin:
 *   get:
 *     summary: Get all countries (admin view with pagination)
 *     tags: [Location Controller]
 *     parameters:
 *       - in: query
 *         name: pageIndex
 *         schema:
 *           type: integer
 *         description: Page index (default 0)
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Page size (default 10)
 *       - in: query
 *         name: searchText
 *         schema:
 *           type: string
 *         description: Search by country name
 *     responses:
 *       200:
 *         description: Paginated list of countries
 */
router.get("/getAllCountryForAdmin", locationController.getAllCountryForAdmin);

/**
 * @swagger
 * /admin/location/getAllCityForAdmin:
 *   get:
 *     summary: Get all cities (admin view with pagination)
 *     tags: [Location Controller]
 *     parameters:
 *       - in: query
 *         name: pageIndex
 *         schema:
 *           type: integer
 *         description: Page index (default 0)
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Page size (default 10)
 *       - in: query
 *         name: searchText
 *         schema:
 *           type: string
 *         description: Search by city name
 *       - in: query
 *         name: countryId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated list of cities
 */
router.get("/getAllCityForAdmin", locationController.getAllCityForAdmin);

module.exports = router;
