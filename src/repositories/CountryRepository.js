const Country = require("../models/Country");

// 🔍 Find with search text + pagination
async function findBySearchTextWithPagination(searchText, pageIndex = 0, pageSize = 10) {
  const query = {
    countryName: { $regex: searchText, $options: "i" },
    status: 1
  };

  const countries = await Country.find(query)
    .skip(pageIndex * pageSize)
    .limit(pageSize);

  const total = await Country.countDocuments(query);

  return { data: countries, total, pageIndex, pageSize };
}

// 🔍 Find with search + sorting
async function findBySearchText(searchText, sort = { createdAt: -1 }) {
  return Country.find({
    countryName: { $regex: searchText, $options: "i" },
    status: 1
  }).sort(sort);
}

// 📌 Find all by status + pagination
async function findAllByStatus(status, pageIndex = 0, pageSize = 10) {
  const query = { status };

  const countries = await Country.find(query)
    .skip(pageIndex * pageSize)
    .limit(pageSize);

  const total = await Country.countDocuments(query);

  return { data: countries, total, pageIndex, pageSize };
}

// 🔍 Find country by search text (status != 0)
async function findCountryBySearchText(searchText, pageIndex = 0, pageSize = 10) {
  const query = {
    countryName: { $regex: searchText, $options: "i" },
    status: { $ne: 0 }
  };

  const countries = await Country.find(query)
    .skip(pageIndex * pageSize)
    .limit(pageSize);

  const total = await Country.countDocuments(query);

  return { data: countries, total, pageIndex, pageSize };
}

// 📌 Find all countries (status != 0) with pagination
async function findCountryByStatus(pageIndex = 0, pageSize = 10) {
  const query = { status: { $ne: 0 } };

  const countries = await Country.find(query)
    .skip(pageIndex * pageSize)
    .limit(pageSize);

  const total = await Country.countDocuments(query);

  return { data: countries, total, pageIndex, pageSize };
}

module.exports = {
  findBySearchTextWithPagination,
  findBySearchText,
  findAllByStatus,
  findCountryBySearchText,
  findCountryByStatus
};
