// controllers/locationController.js
const locationService = require("../services/LocationService");
const logger = require("../utils/logger"); 

// exports.getCities = async (req, res) => {
//   try {
//     const { countryCode } = req.params;
//     const { limit = 10 } = req.query;
//     const result = await locationService.getAllCity(countryCode, parseInt(limit));
//     res.json(result);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

exports.uploadCityFile = async (req, res) => {
  try {
    const uploadCityRequest = { 
      countryId: req.body.countryId || req.query.countryId, 
      file: req.file 
    }; // file comes from multer

    const result = await locationService.uploadCities(uploadCityRequest);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};


exports.addCountry = async (req, res) => {
  try {
    const result = await locationService.addCountry(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to add country", error: error.message });
  }
};

exports.getAllCountry = async (req, res) => {
  try {
    let { pageIndex = 0, pageSize = 10, searchText = "" } = req.query;

    logger.info(`🌍 getAllCountry request received`, { pageIndex, pageSize, searchText });

    pageIndex = parseInt(pageIndex, 10);
    pageSize = parseInt(pageSize, 10);
    searchText = typeof searchText === "string" ? searchText.trim() : "";

    logger.debug("📄 Parsed query params", { pageIndex, pageSize, searchText });

    const result = await locationService.getAllCountry(pageIndex, pageSize, searchText);

    logger.info(`✅ getAllCountry success, count=${result?.data?.length || 0}`);

    res.status(200).json(result);
  } catch (error) {
    logger.error("❌ getAllCountry error", { error: error.message, stack: error.stack });
    res.status(500).json({ message: "Failed to fetch countries", error: error.message });
  }
};


exports.addCity = async(req, res) =>{
  try {
    const cityRequest = {
      id: req.body.id,
      countryId: req.body.countryId,
      cityName: req.body.cityName,
      latitude: req.body.latitude ? parseFloat(req.body.latitude) : 0,
      longitude: req.body.longitude ? parseFloat(req.body.longitude) : 0,
      cityImageFile: req.files?.cityImageFile?.[0] || null,
      cityIconFile: req.files?.cityIconFile?.[0] || null,
    };

    const response = await locationService.addCity(cityRequest);
    res.status(response.responseCode).json(response);
  } catch (err) {
    console.error("addCity controller error:", err);
    res.status(500).json(buildResponse(500, "Internal Server Error", null));
  }
};

// POST /api/v1/admin/location/blockUnblockCountry
exports.blockUnblockCountry = async (req, res) => {
  try {
    const { id, status } = req.body;
    const result = await locationService.blockUnblockCountry(id, status);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to update country", error: error.message });
  }
};

// POST /api/v1/admin/location/blockUnblockCity
exports.blockUnblockCity = async (req, res) => {
  try {
    const { id, status } = req.body;
    const result = await locationService.blockUnblockCity(id, status);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to update city", error: error.message });
  }
};

// GET /api/v1/admin/location/getAllCity
// exports.getAllCity = async (req, res) => {
//   try {
//     const { countryId, pageIndex, pageSize, searchText } = req.query;
//     const result = await locationService.getAllCity(countryId, pageIndex, pageSize, searchText);
//     res.json(result);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch cities", error: error.message });
//   }
// };

// GET /api/v1/admin/location/getAllCountryForAdmin
exports.getAllCountryForAdmin = async (req, res) => {
  try {
    const { pageIndex, pageSize, searchText } = req.query;
    const result = await locationService.getAllCountryForAdmin(pageIndex, pageSize, searchText);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admin countries", error: error.message });
  }
};

// GET /api/v1/admin/location/getAllCityForAdmin
exports.getAllCityForAdmin = async (req, res) => {
  try {
    const { pageIndex, pageSize, searchText,countryId } = req.query;
    const result = await locationService.getAllCityForAdmin(countryId, pageIndex, pageSize, searchText);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admin cities", error: error.message });
  }
};
