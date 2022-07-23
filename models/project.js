const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    sname: {
      type: String,
      default: "",
    },
    intro: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("projects", ProjectSchema);
