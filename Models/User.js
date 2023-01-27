const mongoose = require("mongoose");

const UploadSchema = mongoose.Schema(
  {
    Sr_No: {
      type: Number,
      unique: true,
      required: false,
    },
    Purchase_Recurring: {
      type: String,
      required: false,
    },
    Acadmic_Year: {
      type: String,
      required: false,
    },
    Item: {
      type: String,
      required: false,
    },
    Description: {
      type: String,
      required: false,
    },
    Quantity: {
      type: String,
      required: false,
    },
    Total_Quantity: {
      type: String,
      required: false,
    },
    Price: {
      type: String,
      required: false,
    },
    Total: {
      type: String,
      required: false,
    },
    Bill_No: {
      type: String,
      required: false,
    },
    Invoice_Date: {
      type: String,
      required: false,
    },
    PO_No: {
      type: String,
      required: false,
    },
    PO_Date: {
      type: String,
      required: false,
    },
    Supllier_Name: {
      type: String,
      required: false,
    },
    Address: {
      type: String,
      required: false,
    },
    Contact: {
      type: String,
      required: false,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = Upload = mongoose.model("Upload", UploadSchema);
