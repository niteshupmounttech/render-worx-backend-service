const Country = require("../models/Country");
const City = require("../models/City");
const fileUtil = require("../utils/FileUtil");
const buildResponse = require("../utils/response");
const XLSX = require("xlsx");
const logger = require("../utils/logger"); // adjust path if needed
const {
  buildCountryResponse,
  buildCityResponse,
} = require("../utils/ResponseBuilder");

/**
 * Upload Cities from Excel
 */
async function uploadCities(uploadCityRequest) {
  try {
    if (!uploadCityRequest.file) {
      logger.warn("⚠️ uploadCities: File not provided");
      return buildResponse(400, "File not provided", null);
    }

    logger.info(`📂 uploadCities: Processing file for countryId=${uploadCityRequest.countryId}`);

    const workbook = XLSX.read(uploadCityRequest.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    logger.info(`📑 Parsed ${rows.length - 1} city records from Excel`);

    for (let i = 1; i < rows.length; i++) {
      const [cityName, latitude, longitude, cityIconFile, cityImageFile, cityFileUrl] = rows[i];

      logger.info(`➡️ Processing city: ${cityName} (Row ${i + 1})`);

      const finalImage = cityFileUrl
        ? await fileUtil.extractPictures(cityFileUrl)
        : cityImageFile
        ? await fileUtil.downloadImage(cityImageFile)
        : null;

      const cityIcon = cityIconFile ? await fileUtil.downloadImage(cityIconFile) : null;

      const newCity = new City({
        countryId: uploadCityRequest.countryId,
        cityName,
        latitude,
        longitude,
        cityIcon,
        cityImage: finalImage,
      });

      await newCity.save();
      logger.info(`✅ City saved: ${cityName}`);
    }

    logger.info("🎉 uploadCities: All cities uploaded successfully");
    return buildResponse(200, "Cities uploaded successfully", null);

  } catch (err) {
    logger.error("❌ uploadCities error", { error: err });
    return buildResponse(500, "Failed to upload cities", null);
  }
}


/**
 * Add or update Country
 */
async function addCountry(countryRequest) {
  try {
    if (countryRequest.id) {
      const country = await Country.findById(countryRequest.id);
      if (!country) return buildResponse(404, "Country not found", null);

      country.countryName = countryRequest.countryName;
      country.countryCode = countryRequest.countryCode;
      country.countryShortCode = countryRequest.countryShortCode;
      country.currencyCode = countryRequest.currencyCode;
      country.currencySymbol = countryRequest.currencySymbol;
      country.updatedAt = new Date();

      await country.save();
      return buildResponse(200, "Country updated successfully", buildCountryResponse(country));
    } else {
      const country = new Country({
        countryName: countryRequest.countryName,
        countryCode: countryRequest.countryCode,
        countryShortCode: countryRequest.countryShortCode,
        currencyCode: countryRequest.currencyCode,
        currencySymbol: countryRequest.currencySymbol,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await country.save();
      return buildResponse(201, "Country created successfully", buildCountryResponse(country));
    }
  } catch (err) {
    console.error("addCountry error:", err);
    return buildResponse(500, "Failed to add/update country", null);
  }
}

/**
 * Add or update City
 */
async function addCity(cityRequest) {
  try {
    logger.info("➡️ addCity called", { cityRequest });

    const country = await Country.findById(cityRequest.countryId);
    if (!country) {
      logger.warn(`⚠️ Country not found: ${cityRequest.countryId}`);
      return buildResponse(404, "Country not found", null);
    }

    if (cityRequest.id) {
      logger.info(`🔄 Updating city with ID: ${cityRequest.id}`);
      const city = await City.findById(cityRequest.id);
      if (!city) {
        logger.warn(`⚠️ City not found: ${cityRequest.id}`);
        return buildResponse(404, "City not found", null);
      }

      if (cityRequest.cityImageFile) {
        city.cityImage = await fileUtil.uploadFile(cityRequest.cityImageFile);
        logger.info("📸 Updated cityImage");
      }

      if (cityRequest.cityIconFile) {
        city.cityIcon = await fileUtil.uploadFile(cityRequest.cityIconFile);
        logger.info("🖼️ Updated cityIcon");
      }

      city.latitude = cityRequest.latitude;
      city.longitude = cityRequest.longitude;
      city.cityName = cityRequest.cityName;
      city.updatedAt = new Date();

      await city.save();
      logger.info(`✅ City updated successfully: ${city.id}`);
      return buildResponse(200, "City updated successfully", await buildCityResponse(city,city.countryId));
   
    } else {
      logger.info(`➕ Creating new city: ${cityRequest.cityName}`);

      const exists = await City.findOne({
        cityName: new RegExp(`^${cityRequest.cityName}$`, "i"),
      });
      if (exists) {
        logger.warn(`⚠️ City already exists: ${cityRequest.cityName}`);
        return buildResponse(400, "City already exists", null);
      }

      const newCity = new City({
        countryId: cityRequest.countryId,
        cityName: cityRequest.cityName,
        latitude: cityRequest.latitude,
        longitude: cityRequest.longitude,
        cityImage: cityRequest.cityImageFile
          ? await fileUtil.uploadFile(cityRequest.cityImageFile)
          : null,
        cityIcon: cityRequest.cityIconFile
          ? await fileUtil.uploadFile(cityRequest.cityIconFile)
          : null,
      });

      await newCity.save();
      logger.info(`✅ City created successfully: ${newCity.id}`);
      return buildResponse(201, "City created successfully",await buildCityResponse(newCity,newCity.countryId));
    }
  } catch (err) {
    logger.error("❌ addCity error", { error: err });
    return buildResponse(500, "Failed to add/update city", null);
  }
}

/**
 * Block/Unblock Country
 */
async function blockUnblockCountry(id, status) {
  try {
    const country = await Country.findById(id);
    if (!country) return buildResponse(404, "Country not found", null);

    if (country.status === status) {
      const msg =
        status === 1 ? "Country already unblocked" : "Country already blocked";
      return buildResponse(400, msg, null);
    }

    country.status = status;
    country.updatedAt = new Date();
    await country.save();

    const msg =
      status === 0
        ? "Country deleted"
        : status === 1
        ? "Country unblocked"
        : "Country blocked";
    return buildResponse(200, msg, buildCountryResponse(country));
  } catch (err) {
    console.error("blockUnblockCountry error:", err);
    return buildResponse(500, "Failed to update country status", null);
  }
}

/**
 * Block/Unblock City
 */
async function blockUnblockCity(id, status) {
  try {
    const city = await City.findById(id);
    if (!city) return buildResponse(404, "City not found", null);

    if (city.status === status) {
      const msg =
        status === 1 ? "City already unblocked" : "City already blocked";
      return buildResponse(400, msg, null);
    }

    city.status = status;
    city.updatedAt = new Date();
    await city.save();

    const msg =
      status === 0
        ? "City deleted"
        : status === 1
        ? "City unblocked"
        : "City blocked";
    return buildResponse(200, msg, await buildCityResponse(city,city.countryId));
  } catch (err) {
    console.error("blockUnblockCity error:", err);
    return buildResponse(500, "Failed to update city status", null);
  }
}

/**
 * Get all countries
 */
async function getAllCountry(pageIndex, pageSize, searchText) {
  logger.info(
    `getAllCountry called with pageIndex=${pageIndex}, pageSize=${pageSize}, searchText=${searchText}`
  );

  try {
    const query = searchText
      ? { countryName: { $regex: searchText, $options: "i" }, status: 1 }
      : { status: 1 };

    logger.info(`MongoDB query for countries: ${JSON.stringify(query)}`);

    const total = await Country.countDocuments(query);
    logger.info(`Total countries found: ${total}`);

    const countries = await Country.find(query)
      .sort({ countryName: -1 })
      .skip(pageIndex * pageSize)
      .limit(pageSize);

    logger.info(`Countries retrieved: ${countries.length}`);

    if (!countries.length) {
      logger.warn("No countries found");
      return buildResponse(404, "No countries found", { total, data: [] });
    }

    logger.info("Countries retrieved successfully");
    return buildResponse(200, "Countries retrieved successfully", {
      total,
      pageIndex,
      pageSize,
      data: countries.map(buildCountryResponse),
    });
  } catch (err) {
    logger.error("getAllCountry error:", err);
    return buildResponse(500, "Failed to retrieve countries", null);
  }
}


/**
 * Get all cities
 */
// async function getAllCity(countryId, pageIndex, pageSize, searchText) {
//   try {
//     const query = { status: 1 };
//     if (countryId) query.countryId = countryId;
//     if (searchText) query.cityName = { $regex: searchText, $options: "i" };

//     const total = await City.countDocuments(query);
//     const cities =
//       pageIndex !== undefined && pageSize !== undefined
//         ? await City.find(query)
//             .sort({ cityName: -1 })
//             .skip(pageIndex * pageSize)
//             .limit(pageSize)
//         : await City.find(query).sort({ cityName: -1 });

//     if (!cities.length) return buildResponse(404, "No cities found", null);

//     return buildResponse(200, "Cities retrieved successfully", cities);
//   } catch (err) {
//     console.error("getAllCity error:", err);
//     return buildResponse(500, "Failed to retrieve cities", null);
//   }
// }

/**
 * Get all countries (Admin)
 */
async function getAllCountryForAdmin(pageIndex, pageSize, searchText) {
  try {
    const query = { status: { $ne: 0 } };
    if (searchText) query.countryName = { $regex: searchText, $options: "i" };

    const total = await Country.countDocuments(query);
    const countries =
      pageIndex !== undefined && pageSize !== undefined
        ? await Country.find(query)
            .sort({ countryName: -1 })
            .skip(pageIndex * pageSize)
            .limit(pageSize)
        : await Country.find(query).sort({ countryName: -1 });

    if (!countries.length)
      return buildResponse(404, "No countries found", null);

    return buildResponse(200, "Countries retrieved successfully", {
      data: countries.map(buildCountryResponse),
      pageIndex: pageIndex || 0,
      pageSize: pageSize || countries.length,
      total,
    });
  } catch (err) {
    console.error("getAllCountryForAdmin error:", err);
    return buildResponse(500, "Failed to retrieve countries", null);
  }
}

/**
 * Get all cities (Admin)
 */
async function getAllCityForAdmin(countryId, pageIndex, pageSize, searchText) {
  try {
    const query = { status: { $ne: 0 } };

    if (countryId) query.countryId = countryId;
    if (searchText) query.cityName = { $regex: searchText, $options: "i" };

    const total = await City.countDocuments(query);

    const cities =
      pageIndex !== undefined && pageSize !== undefined
        ? await City.find(query)
            .sort({ cityName: -1 })
            .skip(pageIndex * pageSize)
            .limit(pageSize)
        : await City.find(query).sort({ cityName: -1 });

    if (!cities.length) return buildResponse(404, "No cities found", null);

    // ✅ Build async city responses (wait for all promises)
    const cityResponses = await Promise.all(
      cities.map(async (city) => await buildCityResponse(city, city.countryId))
    );

    return buildResponse(200, "Cities retrieved successfully", {
      data: cityResponses,
      pageIndex: pageIndex || 0,
      pageSize: pageSize || cities.length,
      total,
    });
  } catch (err) {
    console.error("❌ getAllCityForAdmin error:", err);
    return buildResponse(500, "Failed to retrieve cities", null);
  }
}


module.exports = {
  addCountry,
  addCity,
  blockUnblockCountry,
  blockUnblockCity,
  getAllCountryForAdmin,
  getAllCityForAdmin,
  getAllCountry, // optional alias
  //getAllCity, // optional alias
  uploadCities,
};
