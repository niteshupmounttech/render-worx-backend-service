const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema(
  {
    countryCode: {
      type: String,
      required: true,
      trim: true,
    },
    countryName: {
      type: String,
      required: true,
      trim: true,
    },
    countryShortCode: {
      type: String,
      trim: true,
    },
    currencyCode: {
      type: String,
      trim: true,
    },
    currencySymbol: {
      type: String,
      trim: true,
    },
    status: {
      type: Number,
      default: 1, // like your Java short status
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" }, // auto handles dates
    collection: "countries", // same as @Document(collection="countries")
  }
);

module.exports = mongoose.model("countries", countrySchema);
