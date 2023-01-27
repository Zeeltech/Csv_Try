const express = require("express");
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");
const router = require("./routes/uploadRoute");
const datarouter = require("./routes/dataRoute");
const path = require("path");
const dotenv = require("dotenv").config();
const cors = require("cors");

const app = express();

mongoose.connect(process.env.MONGO_URL);

app.use(cors());

app.use("/", router);

app.use("/data", datarouter);

app.use(cors());
app.listen(port, () => console.log(`Server started on ${port}`));
