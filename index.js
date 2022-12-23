const express = require("express");
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");
const router = require("./routes/uploadRoute");
const path = require("path");
const dotenv = require("dotenv").config();

const app = express();

mongoose.connect(process.env.MONGO_URL);

app.use("/", router);

app.listen(port, () => console.log(`Server started on ${port}`));


