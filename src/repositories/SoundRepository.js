const Sound = require("../models/Sound");

exports.createSound = async (data) => {
  return await Sound.create(data);
};

exports.updateSound = async (id, data) => {
  return await Sound.findByIdAndUpdate(id, data, { new: true });
};
