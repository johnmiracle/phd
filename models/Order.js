const mongoose = require("mongoose");

const Orderschema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  cart: {
    type: Object,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  name: {
    type: String,
    require: true
  },
  paymentId: {
    type: String,
    required: true
  }
});

module.exports = Order = mongoose.model("Order", Orderschema);
