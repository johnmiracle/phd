const express = require("express");
const router = express.Router();

// Product Model
const product = require("../models/Products");

router.get("/add-product", (req, res, nwxt) => {
  res.render("adminDashboard");
});

router.post("/products/add", (req, res, nwxt) => {
 console.log(Submitted)
});

module.exports = router;
