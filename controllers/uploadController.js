const Upload = require("../Models/User");
const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");
const User = require("../Models/User");
var xlsx = require("node-xlsx");
var rimraf = require("rimraf");
var chmodr = require("chmodr");

exports.create = async (req, res) => {
  var rows = [];
  var writeStr = "";
  var obj = xlsx.parse(
    path.join(__dirname, "../", "/public/files/" + req.file.filename)
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
        return console.log(err);
      }
      console.log("test.csv was saved in the current directory!");
    }
  );

  console.log(req.file);

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
              console.log("YoBro");
            }
          });

          fs.rmSync("./public/files", { recursive: true, force: true });

          console.log("pela");

          res.json({
            message: "Data entered Successfully",
            users,
          });
        } catch (error) {
          return res.status(400).json(error);
        }
      });
    /*  */
  } catch (error) {
    res.status(400).json(error);
  }
};
