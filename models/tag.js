const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    roster: {
      type: ObjectId,
      ref: "users",
    },
    project: {
      type: ObjectId,
      ref: "projects",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("tags", TagSchema);
