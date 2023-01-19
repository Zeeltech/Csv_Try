const express = require("express");
const exportdata = require("../controllers/dataController");
const router = express.Router();

router.get("/export", exportdata);

module.exports = router;
