const mongoose = require("mongoose");

const citySchema = new mongoose.Schema(
  {
    countryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "countries", // Reference to Country collection
      required: true,
    },
    cityName: {
      type: String,
      required: true,
      trim: true,
    },
    cityImage: {
      type: String,
      default: "",
    },
    cityIcon: {
      type: String,
      default: "",
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    status: {
      type: Number,
      default: 1, // short in Java = small int, here we use Number
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "cities" }
);

module.exports = mongoose.model("cities", citySchema);
