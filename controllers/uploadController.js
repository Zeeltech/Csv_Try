const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");
const User = require("../Models/User");
var xlsx = require("node-xlsx");
var chmodr = require("chmodr");

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

    var rows = [];
    var writeStr = "";
    var obj = xlsx.parse(
      path.join(__dirname, "../", "/public/files/" + files[k].filename) //parsing each file
    );

    for (var i = 0; i < obj.length; i++) {
      var sheet = obj[i];
      for (var j = 0; j < sheet["data"].length; j++) {
        //pushing each sheet's data to rows
        rows.push(sheet["data"][j]);
      }
    }
    for (var i = 0; i < rows.length; i++) {
      writeStr += rows[i].join(",") + "\n"; //writing string to add into .csv file
    }
    fs.writeFile(
      (path1 = path.join(
        __dirname,
        "../",
        "/public/files/",
        `${Date.now()}` + "test.csv"
      )), //writing to .csv file with unique name
      writeStr, //string to be written
      function (err) {
        if (err) {
          return console.log("test.csv failed");
        }
        console.log("test.csv was saved in the current directory!");
      }
    );

    const allRecords = [];

    //for pushing json to database

    try {
      fs.createReadStream(path1) //reading the file on path - path1
        .pipe(csv.parse({ headers: true }))
        .on("error", (err) => console.log(err))
        .on("data", (row) => {
          allRecords.push(row); //pushing a single row into allRecords array
          console.log(row);
        })
        .on("end", async (rowCount) => {
          console.log(`${rowCount} rows has been PARSED`);
          try {
            const users = await User.insertMany(allRecords); //insert all records into database

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

            fs.rmSync("./public/files", { recursive: true, force: true });
          }
        });
    } catch (error) {
      res.status(400).json(error);
    }
  }
  res.status(200).json({ message: "Data entered successfully" });
};
