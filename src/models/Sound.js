const mongoose = require("mongoose");

const SoundSchema = new mongoose.Schema({
  soundUrl: { type: String },
  title: { type: String },
  status: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("sound", SoundSchema);
