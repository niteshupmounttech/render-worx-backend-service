const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    category: { type: String, default: "" },
    year: { type: String, default: "" },
    city: { type: String, default: "" },
    country: { type: String, default: "" },
    location: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    fullDescription: { type: String, default: "" },
    status: { type: Number, default: 1 },
    featured: { type: Boolean, default: false },
    clientName: { type: String, default: "" },
    surfaceArea: { type: String, default: "" },
    scope: { type: String, default: "" },
    softwareUsed: { type: String, default: "" },
    tags: [{ type: String }],
    thumbnailFile: { type: String, default: "" },
    galleryFiles: [{ type: String }],
  },
  { timestamps: true, collection: "portfolios" }
);

module.exports = mongoose.model("portfolios", PortfolioSchema);
