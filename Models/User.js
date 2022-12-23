const mongoose = require("mongoose");

const UploadSchema = mongoose.Schema(
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
    timestamp: true,
  }
);

module.exports = Upload = mongoose.model("Upload", UploadSchema);
