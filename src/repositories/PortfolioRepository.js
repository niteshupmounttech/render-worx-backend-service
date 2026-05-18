const Portfolio = require("../models/Portfolio");

exports.createPortfolio = async (data) => {
  return await Portfolio.create(data);
};

exports.updatePortfolio = async (id, data) => {
  return await Portfolio.findByIdAndUpdate(id, data, { new: true });
};

exports.findById = async (id) => {
  return await Portfolio.findById(id);
};

exports.findAll = async (query, skip, limit) => {
  return await Portfolio.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
};

exports.countDocuments = async (query) => {
  return await Portfolio.countDocuments(query);
};
