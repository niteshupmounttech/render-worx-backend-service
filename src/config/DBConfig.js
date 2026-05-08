const mongoose = require("mongoose");
module.exports = async function connectDB() {
  const uri = process.env.MONGO_URL || "mongodb://localhost:27017/render_worx_db?authSource=admin";
  await mongoose.connect(uri);
  console.log("UserService Mongo connected");
};
