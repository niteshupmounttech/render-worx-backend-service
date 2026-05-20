const OurService = require("../models/OurService");

exports.createService = async (data) => {
  return await OurService.create(data);
};

exports.updateService = async (id, data) => {
  return await OurService.findByIdAndUpdate(id, data, { new: true });
};

exports.findById = async (id) => {
  return await OurService.findById(id);
};

exports.findAll = async (query, skip, limit) => {
  return await OurService.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
};

exports.countDocuments = async (query) => {
  return await OurService.countDocuments(query);
};
