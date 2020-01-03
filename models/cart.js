const product = require("../models/Products");

module.exports = function Cart(oldCart) {
  this.items = oldCart.items || {};
  this.totalQty = oldCart.totalQty || 0;
  this.tax = oldCart.tax;
  this.totalPrice = oldCart.totalPrice || 0;

  this.add = function(item, id) {
    let storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = { item: item, qty: 0, price: 0, tax: 0.5 };
    }
    storedItem.qty++;
    storedItem.price = storedItem.item.price * storedItem.qty 
    this.totalQty++;
    this.totalPrice += storedItem.price + storedItem.tax;
  };
  this.reduceByOne = function(id) {
    this.items[id].qty--;
    this.items[id].price -= this.items[id].item.price;
    this.totalQty--;
    this.totalPrice -= this.items[id].item.price;

    if (this.items[id].qty <= 0) {
      delete this.items[id];
    }
  };
   this.increaseByOne = function(id) {
     this.items[id].qty--;
     this.items[id].price -= this.items[id].item.price;
     this.totalQty--;
     this.totalPrice -= this.items[id].item.price;
   };
  this.removeItem = function(id) {
    this.totalQty -= this.items[id].qty;
    this.totalPrice -= this.items[id].price;
    delete this.items[id];
  };

  this.generateArray = () => {
    const arr = [];
    for (let id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  };
};