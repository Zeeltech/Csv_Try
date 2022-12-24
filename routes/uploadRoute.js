const express = require("express");
const csvController = require("../controllers/uploadController");
const multer = require("multer"); // is a MIDDLEWARE to handle form-data
const fs = require("fs"); // its File System to work with file on our system
const path = require("path"); // to join paths of file and directories

const storage = multer.diskStorage({ 
  destination: function (req, file, cb) { //providing destination to store file
    if (!fs.existsSync("public")) {   //if public folder in file system exist ?
      fs.mkdirSync("public");
    }

    if (!fs.existsSync("public/files")) {
      fs.mkdirSync("public/files");
    }

    cb(null, "public/files");  
  },
  filename: function (req, file, cb) {
    /* console.log(file); */
    cb(null, Date.now() + file.originalname); //assigning unique filename
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname);  //checking for extention to be .xlsx
    if (ext != ".xlsx") {
      return cb(new Error("Only .xlsx are allowed"));
    }

    cb(null, true);
  },
});

const router = express.Router();

router.post(
  "/create",
  upload.fields([       //upload.fiels and not uploads.single because we wanted to upload multiple file at once 
    {
      name: "uploads",  //uploads is the name of our key field in postman
      maxCount: 5,
    },
  ]),
  csvController.create
);

module.exports = router;
