const mongoose = require("mongoose");

const EnquirySchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    projectType: { type: String, default: "" },
    message: { type: String, default: "" },
    status: { type: Number, default: 1 },
  },
  { timestamps: true, collection: "enquiries" }
);

module.exports = mongoose.model("enquiries", EnquirySchema);
