const express = require("express");
const router = express.Router();

const adminController = require('../controllers/adminCollector')

router.get("/add-product", adminController.addproductpage);
router.post("/products/add",adminController.addproduct);
router.get("/add-category", adminController.addcategorypage);
router.post("/category/add", adminController.addcategory);

module.exports = router;
