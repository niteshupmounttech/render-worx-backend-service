const mongoose = require("mongoose");

const OurServiceSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    subTitle: { type: String, default: "" },
    shortDescriptions: { type: String, default: "" },
    fullDescriptions: { type: String, default: "" },
    serviceOffered: [{ type: String }],
    icon: { type: String, default: "" },
    thumbnailFile: { type: String, default: "" },
    galleryFiles: [{ type: String }],
    status: { type: Number, default: 1 },
  },
  { timestamps: true, collection: "our_services" }
);

module.exports = mongoose.model("our_services", OurServiceSchema);
