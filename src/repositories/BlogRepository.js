const Blog = require("../models/Blog");

exports.createBlog = async (data) => {
  return await Blog.create(data);
};

exports.updateBlog = async (id, data) => {
  return await Blog.findByIdAndUpdate(id, data, { new: true });
};

exports.findById = async (id) => {
  return await Blog.findById(id);
};

exports.findAll = async (query, skip, limit) => {
  return await Blog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
};

exports.countDocuments = async (query) => {
  return await Blog.countDocuments(query);
};
