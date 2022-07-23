const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const UpdateSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    user: {
      type: ObjectId,
      ref: "users",
      required: true,
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

module.exports = mongoose.model("updates", UpdateSchema);
