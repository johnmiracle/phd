const mongoose = require("mongoose");
const User = require("../models/User");

const Categoryschema = new mongoose.Schema({
  name: {
    type: String,
    required: "Please input category name"
  },
  description: {
    type: String,
    required: "Please fill the description"
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Category", Categoryschema);
