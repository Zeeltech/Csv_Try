const path = require("path");
const Data = require("../Models/Data");
var xlsx = require("xlsx");
var chmodr = require("chmodr");
const fs = require("fs");

const exportdata = async (req, res) => {
  var wb = xlsx.utils.book_new();
  Data.find({}, { _id: 0 }, (err, data) => {
    if (err) {
      console.log("Error : ", err);
    } else {
      var temp = JSON.stringify(data); // Convert JSON to Json string
      temp = JSON.parse(temp); // Convert to object
      var ws = xlsx.utils.json_to_sheet(temp); // Convert Json Object into sheet of EXCEL
      xlsx.utils.book_append_sheet(wb, ws, "sheet1"); //Append sheets into wb
      xlsx.writeFile(
        //Now creating new file with unique name and writing EXCEL data to it
        wb,
        (path1 = path.join(
          __dirname,
          "../",
          "/datafetcher/",
          `${Date.now()}` + "test.xlsx"
        ))
      );
      res.download(path1);
    }
  });
};

module.exports = exportdata;
