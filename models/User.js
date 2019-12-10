const mongoose = require("mongoose");

const Userschema = new mongoose.Schema({
  firstName: {
    type: String,
    required: "Please this field is required",
    trim: true
  },
  lastName: {
    type: String,
    required: "Please this field is required",
    trim: true
  },
  email: {
    type: String,
    required: "please this field is required",
    unique: true
  },
  phone: {
    type: Number,
    required: "Please supply your phone Number",
    trim: true
  },
  password: {
    type: String,
    required: "Please this field is required"
  },
  address: String,
  audience: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", Userschema);
