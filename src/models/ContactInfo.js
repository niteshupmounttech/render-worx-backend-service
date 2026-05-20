const mongoose = require("mongoose");

const ContactInfoSchema = new mongoose.Schema(
  {
    email: { type: String, default: "" },
    mobile: { type: String, default: "" },
    address: { type: String, default: "" },
  },
  { timestamps: true, collection: "contact_info" }
);

module.exports = mongoose.model("contact_info", ContactInfoSchema);
