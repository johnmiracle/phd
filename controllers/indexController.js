const Product = require("../models/Products");
const passport = require("passport");
const Cart = require("../models/cart");

exports.home = (req, res, next) => {
  res.render("index");
};

exports.banner = (req, res, next) => {
  res.render("Banners");
};

exports.brouchures = (req, res, next) => {
  Product.find({}, (err, products) => {
    if (err) {
      req.flash("Danger", "Unable to load Products");
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
  Product.findById(productId, function(err, product) {
    if (err) {
      return res.redirect("/");
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect("/");
  });
};

exports.addOne = (req, res, next) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.increaseByOne(productId);
  req.session.cart = cart;
  res.redirect("/cart");
};

exports.removeOne = (req, res, next) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect("/cart");
};

exports.cart = (req, res, next) => {
  if (!req.session.cart) {
    return res.render("cart", {
      products: null
    });
  }
  const cart = new Cart(req.session.cart);
  res.render("cart", {
    products: cart.generateArray(),
    tax: cart.tax,
    totalPrice: cart.totalPrice
  });
};

exports.removeCart = (req, res, next) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect("/cart");
};

exports.contact = (req, res, next) => {
  res.render("contact_page");
};

exports.contact_us = (req, res, next) => {
  const { name, email, message } = req.body;
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
  req.session.cart = null;
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
    res.render("product", { product });
  });
};

exports.categories = (req, res, next) => {
  Category.find(function(err, categories) {
    if (err) return console.log(err);
    res.status(200).json(categories);
  });
};

exports.checkout = (req, res, next) => {
  if (!req.session.cart) {
    return res.render("checkout", {
      products: null
    });
  }
  const cart = new Cart(req.session.cart);
  res.render("checkout", {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice
  });
};

exports.checkout_action = (req, res, next) => {
  const cart = new Cart(req.session.cart);

  // setup the payment object
  const payment = {
    intent: "sale",
    payer: {
      payment_method: "paypal"
    },
    redirect_urls: {
      return_url: session.baseUrl + "/paypal/checkout_return",
      cancel_url: session.baseUrl + "/paypal/checkout_cancel"
    },

    transactions: [
      {
        items_list: {},
        amount: {
          total: cart.totalPrice,
          currency: "NGN"
        },
        description: cart.description
      }
    ]
  };

  // create payment
  paypal.payment.create(payment, (error, payment) => {
    if (error) {
      req.flash("Danger", "There was an error processing your payment. You have not been changed and can try again.");
      res.redirect("/checkout");
      return;
    } else {
      console.log("Create Payment Response");
      console.log(payment);
      res.redirect("/cart");
    }
    // if (payment.payer.payment_method === "paypal") {
    //   req.session.paymentId = payment.id;
    //   let redirectUrl;
    //   for (let i = 0; i < payment.links.length; i++) {
    //     const link = payment.links[i];
    //     if (link.method === "REDIRECT") {
    //       redirectUrl = link.href;
    //     }
    //   }

    //   // if there is no items in the cart then render a failure
    //   if (!req.session.cart) {
    //     req.flash("Danger", "The are no items in your cart. Please add some items before checking out");
    //     res.redirect("/cart");
    //     return;
    //   }

    //   // new order doc
    //   const orderDoc = {
    //     orderPaymentId: payment.id,
    //     orderPaymentGateway: "Paypal",
    //     orderTotal: req.session.totalCartAmount,
    //     orderEmail: req.body.shipEmail,
    //     orderFirstname: req.body.shipFirstname,
    //     orderLastname: req.body.shipLastname,
    //     orderAddr1: req.body.shipAddr1,
    //     orderAddr2: req.body.shipAddr2,
    //     orderCountry: req.body.shipCountry,
    //     orderState: req.body.shipState,
    //     orderPostcode: req.body.shipPostcode,
    //     orderPhoneNumber: req.body.shipPhoneNumber,
    //     orderComment: req.body.orderComment,
    //     orderStatus: payment.state,
    //     orderDate: new Date(),
    //     orderProducts: req.session.cart
    //   };
    // }
  });
};
