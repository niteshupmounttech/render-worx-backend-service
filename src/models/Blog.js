const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    writtenBy: { type: String, default: "" },
    difficulty: { type: String, default: "" },
    topic: { type: String, default: "" },
    content: { type: String, default: "" },
    mediaFiles: [{ type: String }],
    status: { type: Number, default: 1 },
  },
  { timestamps: true, collection: "blogs" }
);

module.exports = mongoose.model("blogs", BlogSchema);
