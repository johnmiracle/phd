const mongoose = require("mongoose");
const category = require("../models/Category");

const Productschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique:true,
  },
  // category: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: "category"
  // },
  price: {
    type: Number,
    required: true
  },
  imageUrl: String,
  description: {
    type: String,
    required: true
  },
  inStock: {
    type: Boolean
  },
  created_on: { type: Date, default: Date.now }
});

module.exports = Product = mongoose.model("Product", Productschema);
