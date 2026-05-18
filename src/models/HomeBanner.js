const mongoose = require("mongoose");

const HomeBannerSchema = new mongoose.Schema(
  {
    mediaFiles: { type: String, default: "" },
    type: { type: String, enum: ["image", "video"], required: true },
  },
  { timestamps: true, collection: "home_banners" }
);

module.exports = mongoose.model("home_banners", HomeBannerSchema);
