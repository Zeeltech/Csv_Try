const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");
const User = require("../Models/User");
var xlsx = require("node-xlsx");
var chmodr = require("chmodr");
var xlsx = require("xlsx");

exports.create = async (req, res) => {
  const files = [];
  try {
    if (Array.isArray(req.files.uploads) && req.files.uploads.length > 0) {
      //checking if req.files.uploads is array and it exist or not
      for (let file of req.files.uploads) {
        files.push(file); //pushing each file into files array
      }
    }
  } catch (error) {
    return res.status(401).json({ message: "File Array not Uploaded" });
  }

  for (var k = 0; k < files.length; k++) {
    //loop to iterate through all files in files array
    console.log(files[k].filename);
    //for pushing json to database
    try {
      const path1 = path.join(
        __dirname,
        "../",
        "/public/files/" + files[k].filename
      );
      let xlFile = xlsx.readFile(path1);
      let sheet = xlFile.Sheets[xlFile.SheetNames[0]];

      const P_JSON = xlsx.utils.sheet_to_json(sheet);
      await User.insertMany(P_JSON);
      res.status(200).json({ message: "Data entered successfully" });
      chmodr("./", 0o777, (err) => {
        //giving permission to read,write and execute to current folder
        if (err) {
          console.log("Failed to execute chmod", err);
        } else {
        }
      });

      fs.rmSync("./public/files", { recursive: true, force: true }); // deleting files folder for saving space
    } catch (error) {
      chmodr("./", 0o777, (err) => {
        if (err) {
          console.log("Failed to execute chmod", err);
        } else {
        }
      });
      console.log(error);
      fs.rmSync("./public/files", { recursive: true, force: true });
    }
  }
};
