const express = require("express");
const csvController = require("../controllers/uploadController");
const multer = require("multer"); // is a MIDDLEWARE to handle form-data
const fs = require("fs"); // its File System to work with file on our system
const path = require("path"); // to join paths of file and directories

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync("public")) {
      fs.mkdirSync("public");
    }

    if (!fs.existsSync("public/files")) {
      fs.mkdirSync("public/files");
    }

    cb(null, "public/files");
  },
  filename: function (req, file, cb) {
    /* console.log(file); */
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    if (ext != ".xlsx") {
      return cb(new Error("Only .xlsx are allowed"));
    }

    cb(null, true);
  },
});

const router = express.Router();

router.post(
  "/create",
  upload.fields([
    {
      name: "uploads",
      maxCount: 5,
    },
  ]),
  csvController.create
);

module.exports = router;
