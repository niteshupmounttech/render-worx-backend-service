const mongoose = require("mongoose");

const StatPointSchema = new mongoose.Schema({
  value: { type: String, default: "" },
  label: { type: String, default: "" },
});

const AdvantagePointSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  description: { type: String, default: "" },
});

const WorkStepSchema = new mongoose.Schema({
  step: { type: Number, default: 0 },
  icon: { type: String, default: "" },
  title: { type: String, default: "" },
  description: { type: String, default: "" },
});

const ClientStorySchema = new mongoose.Schema({
  quote: { type: String, default: "" },
  name: { type: String, default: "" },
  title: { type: String, default: "" },
});

const TeamMemberSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  designation: { type: String, default: "" },
  bio: { type: String, default: "" },
  image: { type: String, default: "" },
  order: { type: Number, default: 0 },
});

const AboutUsSchema = new mongoose.Schema(
  {
    mainTitle: { type: String, default: "" },
    mainDescription: { type: String, default: "" },
    mission: { type: String, default: "" },
    vision: { type: String, default: "" },
    aboutImage: { type: String, default: "" },
    statPoints: [StatPointSchema],
    advantagePoints: [AdvantagePointSchema],
    workSteps: [WorkStepSchema],
    clientStories: [ClientStorySchema],
    teamMembers: [TeamMemberSchema],
  },
  { timestamps: true, collection: "about_us" }
);

module.exports = mongoose.model("about_us", AboutUsSchema);
