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
      for (let file of req.files.uploads) {
        files.push(file);
      }
    }
  } catch (error) {
    return res.status(401).json({ message: "File Array not Uploaded" });
  }

  for (var k = 0; k < files.length; k++) {
    console.log(files[k].filename);

    var rows = [];
    var writeStr = "";
    var obj = xlsx.parse(
      path.join(__dirname, "../", "/public/files/" + files[k].filename)
    );

    for (var i = 0; i < obj.length; i++) {
      var sheet = obj[i];
      for (var j = 0; j < sheet["data"].length; j++) {
        rows.push(sheet["data"][j]);
      }
    }
    for (var i = 0; i < rows.length; i++) {
      writeStr += rows[i].join(",") + "\n";
    }
    fs.writeFile(
      (path1 = path.join(
        __dirname,
        "../",
        "/public/files/",
        `${Date.now()}` + "test.csv"
      )),
      writeStr,
      function (err) {
        if (err) {
          return console.log("test.csv failed");
        }
        console.log("test.csv was saved in the current directory!");
      }
    );

    const allRecords = [];

    try {
      fs.createReadStream(path1)
        .pipe(csv.parse({ headers: true }))
        .on("error", (err) => console.log(err))
        .on("data", (row) => {
          allRecords.push(row);
          console.log(row);
        })
        .on("end", async (rowCount) => {
          console.log(`${rowCount} rows has been PARSED`);
          try {
            const users = await User.insertMany(allRecords);

            chmodr("./", 0o777, (err) => {
              if (err) {
                console.log("Failed to execute chmod", err);
              } else {
              }
            });

            fs.rmSync("./public/files", { recursive: true, force: true });
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
