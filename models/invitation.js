const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const invitationSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    from: {
      type: ObjectId,
      ref: "users",
      required: true,
    },
    to: {
      type: ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("invitations", invitationSchema);
