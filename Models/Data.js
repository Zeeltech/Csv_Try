const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      unique: true,
      required: true,
    },
    Subject: {
      type: String,
      required: true,
    },
    Roll_no: {
      type: Number,
      required: true,
    },
  },
  {
    collection: "uploads",
  }
);

module.exports = mongoose.model("data", dataSchema);
