const City = require("../models/City");

// 🔍 Find with search + pagination
async function findBySearchTextWithPagination(searchText, pageIndex = 0, pageSize = 10) {
  const query = { cityName: { $regex: searchText, $options: "i" }, status: 1 };

  const cities = await City.find(query)
    .skip(pageIndex * pageSize)
    .limit(pageSize);

  const total = await City.countDocuments(query);
  return { data: cities, total, pageIndex, pageSize };
}

// 🔍 Find with search + sort
async function findBySearchText(searchText, sort = { createdAt: -1 }) {
  return City.find({ cityName: { $regex: searchText, $options: "i" }, status: 1 }).sort(sort);
}

// 📌 Find all by countryId + pagination
async function findAllByCountryId(countryId, pageIndex = 0, pageSize = 10) {
  const query = { countryId, status: 1 };

  const cities = await City.find(query)
    .skip(pageIndex * pageSize)
    .limit(pageSize);

  const total = await City.countDocuments(query);
  return { data: cities, total, pageIndex, pageSize };
}

// 🔍 Search + country filter + pagination
async function findBySearchTextAndCountryWithPagination(countryId, searchText, pageIndex = 0, pageSize = 10) {
  const query = { countryId, cityName: { $regex: searchText, $options: "i" }, status: 1 };

  const cities = await City.find(query)
    .skip(pageIndex * pageSize)
    .limit(pageSize);

  const total = await City.countDocuments(query);
  return { data: cities, total, pageIndex, pageSize };
}

// 📌 Find all by countryId + sort
async function findAllByCountryIdSorted(countryId, sort = { createdAt: -1 }) {
  return City.find({ countryId, status: 1 }).sort(sort);
}

// 🔍 Find by countryId + search text + sort
async function findByCountryIdAndSearchText(countryId, searchText, sort = { createdAt: -1 }) {
  return City.find({ countryId, cityName: { $regex: searchText, $options: "i" }, status: 1 }).sort(sort);
}

// 🔍 Find by cityName (case-insensitive)
async function findByCityNameIgnoreCase(cityName) {
  return City.findOne({ cityName: new RegExp("^" + cityName + "$", "i") });
}

// 📌 Find all by status + pagination
async function findAllByStatus(status, pageIndex = 0, pageSize = 10) {
  const query = { status };

  const cities = await City.find(query)
    .skip(pageIndex * pageSize)
    .limit(pageSize);

  const total = await City.countDocuments(query);
  return { data: cities, total, pageIndex, pageSize };
}

// 🔍 Search + countryId + status != 0
async function findCityBySearchTextAndCountryId(countryId, searchText, pageIndex = 0, pageSize = 10) {
  const query = { countryId, cityName: { $regex: searchText, $options: "i" }, status: { $ne: 0 } };

  const cities = await City.find(query)
    .skip(pageIndex * pageSize)
    .limit(pageSize);

  const total = await City.countDocuments(query);
  return { data: cities, total, pageIndex, pageSize };
}

// 📌 Find all by countryId + status != 0 + pagination
async function findCityByCountryId(countryId, pageIndex = 0, pageSize = 10) {
  const query = { countryId, status: { $ne: 0 } };

  const cities = await City.find(query)
    .skip(pageIndex * pageSize)
    .limit(pageSize);

  const total = await City.countDocuments(query);
  return { data: cities, total, pageIndex, pageSize };
}

// 🔍 Search text + status != 0
async function findCityBySearchText(searchText, pageIndex = 0, pageSize = 10) {
  const query = { cityName: { $regex: searchText, $options: "i" }, status: { $ne: 0 } };

  const cities = await City.find(query)
    .skip(pageIndex * pageSize)
    .limit(pageSize);

  const total = await City.countDocuments(query);
  return { data: cities, total, pageIndex, pageSize };
}

// 📌 Find all cities with status != 0 + pagination
async function findCityByStatus(pageIndex = 0, pageSize = 10) {
  const query = { status: { $ne: 0 } };

  const cities = await City.find(query)
    .skip(pageIndex * pageSize)
    .limit(pageSize);

  const total = await City.countDocuments(query);
  return { data: cities, total, pageIndex, pageSize };
}

module.exports = {
  findBySearchTextWithPagination,
  findBySearchText,
  findAllByCountryId,
  findBySearchTextAndCountryWithPagination,
  findAllByCountryIdSorted,
  findByCountryIdAndSearchText,
  findByCityNameIgnoreCase,
  findAllByStatus,
  findCityBySearchTextAndCountryId,
  findCityByCountryId,
  findCityBySearchText,
  findCityByStatus
};
