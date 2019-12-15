const Product = require("../models/Products");
const passport =require('passport')
const mongoose = require("mongoose");

exports.home = (req, res, next) => {
  res.render("index");
};
exports.banner = (req, res, next) => {
  res.render("Banners");
};
exports.brouchures = (req, res, next) => {
  Product.find({}, (err, products) => {
    if (err) {
      req.flash('Danger', "Unable to load Products")
    } else {
      res.render("brouchures", { products });
    }
  });
};
exports.businesscards = (req, res, next) => {
  res.render("Business_card");
};
exports.addCart = (req, res, next) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});
  const product = products.filter(function(item) {
    return item.id == productId;
  });
  cart.add(product[0], productId);
  req.session.cart = cart;
  res.redirect("/");
  inline();
};
exports.cart = (req, res, next) => {
  res.render("cart");

  if (!req.session.cart) {
    return res.render("cart", {
      products: null
    });
  }
  const cart = new Cart(req.session.cart);
  res.render("cart", {
    products: cart.getItems(),
    totalPrice: cart.totalPrice
  });
};
exports.removeCart = (req, res, next) => {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.remove(productId);
  req.session.cart = cart;
  res.redirect("/cart");
};
exports.contact = (req, res, next) => {
  res.render("contact_page");
};
exports.gift = (req, res, next) => {
  res.render("corporate_gift");
};
exports.stationary = (req, res, next) => {
  res.render("corporate_stationary");
};
exports.mugs = (req, res, next) => {
  res.render("custom-mugs");
};
exports.tskirt = (req, res, next) => {
  res.render("custom-tskirt");
};
exports.diary = (req, res, next) => {
  res.render("diary_page");
};
exports.getprice = (req, res, next) => {
  res.render("getprice");
};
exports.logo = (req, res, next) => {
  res.render("logo_form");
};
exports.notesJotter = (req, res, next) => {
  res.render("notes&jotter");
};
exports.ourWorks = (req, res, next) => {
  res.render("ourWorks");
};
exports.letterhead = (req, res, next) => {
  res.render("letterhead_page");
};
exports.promotional = (req, res, next) => {
  res.render("promotional");
};
exports.poster = (req, res, next) => {
  res.render("poster");
};
exports.showLogin = (req, res, next) => {
  res.render("login");
};
exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "You've successfully logged out");
  res.redirect("/login");
};
exports.signup = (req, res, next) => {
  res.render("signup");
};
exports.product = (req, res, next) => {
  res.render("product");
};
exports.productId = (req, res, next) => {
  Product.findById(req.params.id, function(err, product) {
    if (err) return console.log(err);
    res.render("product", {product});
  });
};
exports.categories = (req, res, next) => {
  Category.find(function(err, categories) {
    if (err) return console.log(err);
    res.status(200).json(categories);
  });
};
