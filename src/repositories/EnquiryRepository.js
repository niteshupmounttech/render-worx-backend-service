const Enquiry = require("../models/Enquiry");

exports.createEnquiry = async (data) => Enquiry.create(data);

exports.findById = async (id) => Enquiry.findById(id);

exports.updateById = async (id, data) => Enquiry.findByIdAndUpdate(id, data, { new: true });

exports.findAll = async (query, skip, limit) =>
  Enquiry.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

exports.countDocuments = async (query) => Enquiry.countDocuments(query);
