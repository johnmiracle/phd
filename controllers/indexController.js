const Product = require("../models/Products");
const Category = require("../models/Category");
const Order = require("../models/Order");
const passport = require("passport");
const Cart = require("../models/cart");
const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id: "AQ1RbFqSEoUaR6Rwnf7EsIR5WI-mtnvX65u278qLaZECVIRZ_RNydua9Hy8WucTH8N-semXyEyslvJlz",
  client_secret: "ECqZMxWWkjCU5aRO4h05-Nkl0D8mmj5Q5xtH3j3RcpWOdeA5BQU9oLv0Vqjm-yic5_8E1CvT1T7xDXTu"
});

exports.home = (req, res, next) => {
  res.render("index");
};

exports.banner = (req, res, next) => {
  res.render("Banners");
};

exports.brouchures = async (req, res, next) => {
  const product = await Category.findById(req.params.id);
  const products = await Product.find({ category: "5e1d9f48bf4cfc1f581246fd" }).populate("category");
  console.log(products);
  res.render("brouchures", { products });

  // const products = await Product.find({}).populate("category");
  // let category_product = [];
  // if (products.category == "Custom Mugs") {
  //   category_product.push(products);
  //   console.log("miracle");
  // }
  // console.log(category_product);
  // res.render("brouchures", { category_product });
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
      products: null || {}
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
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal"
    },
    redirect_urls: {
      return_url: "http://localhost:3500/checkout_return",
      cancel_url: "http://localhost:3500/checkout"
    },

    transactions: [
      {
        amount: {
          total: cart.totalPrice,
          currency: "USD"
        },
        description: "Sales"
      }
    ]
  };
  paypal.payment.create(create_payment_json, function(error, payment) {
    if (error) {
      req.flash("Danger", "There was an error processing your payment. You have not been changed and can try again.");
      res.redirect("/pay");
      return;
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          res.redirect(payment.links[i].href);
        }
      }
    }
    // if there is no items in the cart then render a failure
    if (!req.session.cart) {
      req.flash("Danger", "The are no items in your cart. Please add some items before checking out");
      res.redirect("/");
      return;
    }

    //     // new order doc
    const orderDoc = new Order({
      user: req.user,
      orderPaymentId: payment.id,
      orderPaymentGateway: "Paypal",
      orderTotal: req.session.totalCartAmount,
      orderEmail: req.body.shipEmail,
      orderNames: req.body.shipFullname,
      orderAddress: req.body.shipAddr1,
      orderCountry: req.body.shipCountry,
      orderState: req.body.shipState,
      orderPostcode: req.body.shipPostcode,
      orderPhone: req.body.shipPhoneNumber,
      orderStatus: payment.state,
      orderDate: new Date(),
      orderProducts: req.session.cart
    });

    if (req.session.orderId) {
      // we have an order ID (probably from a failed/cancelled payment previosuly) so lets use that.

      // send the order to Paypal
      res.redirect(redirectUrl);
    } else {
      // no order ID so we create a new one
      orderDoc.save((err, newDoc) => {
        if (err) {
          console.info(err.stack);
        }

        // get the new ID
        const newId = newDoc.insertedId;

        // set the order ID in the session
        req.session.orderId = newId;

        // set cart to empty
        req.session.cart = null;

        // send the order to Paypal
        res.redirect(redirectUrl);
      });
    }
  });

  // setup the payment object
  // const payment = {
  //   intent: "sale",
  //   payer: {
  //     payment_method: "paypal"
  //   },
  //   redirect_urls: {
  //     return_url: "http://localhost:3500/checkout_return",
  //     cancel_url: "http://localhost:3500/checkout"
  //   },
  //   transactions: [
  //     {
  //       amount: {
  //         total: cart.totalPrice,
  //         currency: "USD"
  //       },
  //       description: "Sales"
  //     }
  //   ]
  // };

  // // create payment
  // paypal.payment.create(payment, (error, payment) => {
  //   if (error) {
  //     req.flash("Danger", "There was an error processing your payment. You have not been changed and can try again.");
  //     res.redirect("/pay");
  //     return;
  //   }
  //   if (payment.payer.payment_method === "paypal") {
  //     req.session.paymentId = payment.id;
  //     let redirectUrl;
  //     for (let i = 0; i < payment.links.length; i++) {
  //       const link = payment.links[i];
  //       if (link.method === "REDIRECT") {
  //         redirectUrl = link.href;
  //       }
  //     }

  //     // if there is no items in the cart then render a failure
  //     if (!req.session.cart) {
  //       req.flash("Danger", "The are no items in your cart. Please add some items before checking out");
  //       res.redirect("/");
  //       return;
  //     }

  //     // new order doc
  //     const orderDoc = new Order({
  //       orderPaymentId: payment.id,
  //       orderPaymentGateway: "Paypal",
  //       orderTotal: req.session.totalCartAmount,
  //       orderEmail: req.body.shipEmail,
  //       orderNames: req.body.shipFullname,
  //       orderAddress: req.body.shipAddr1,
  //       orderCountry: req.body.shipCountry,
  //       orderState: req.body.shipState,
  //       orderPostcode: req.body.shipPostcode,
  //       orderPhone: req.body.shipPhoneNumber,
  //       orderStatus: payment.state,
  //       orderDate: new Date(),
  //       orderProducts: req.session.cart
  //     });

  //     if (req.session.orderId) {
  //       // we have an order ID (probably from a failed/cancelled payment previosuly) so lets use that.

  //       // send the order to Paypal
  //       res.redirect(redirectUrl);
  //     } else {
  //       // no order ID so we create a new one
  //       orderDoc.save((err, newDoc) => {
  //         if (err) {
  //           console.info(err.stack);
  //         }

  //         // send the order to Paypal
  //         res.redirect(redirectUrl);
  //       });
  //     }
  //   }
  // });
};

exports.checkout_cancel = (req, res, next) => {
  res.redirect("/checkout");
};

exports.checkout_return = (req, res, next) => {
  const payerId = req.query.PayerID;
  const paymentId = req.session.paymentId;

  const details = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          total: cart.totalPrice,
          currency: "USD"
        },
        description: "Sales"
      }
    ]
  };
  paypal.payment.execute(paymentId, details, (error, payment) => {
    let paymentApproved = false;
    let paymentMessage = "";
    let paymentDetails = "";
    if (error) {
      paymentApproved = false;

      if (error.response.name === "PAYMENT_ALREADY_DONE") {
        paymentApproved = false;
        paymentMessage = error.response.message;
      } else {
        paymentApproved = false;
        paymentDetails = error.response.error_description;
      }

      // set the error
      req.flash("Danger", error.response.error_description);
      req.session.paymentApproved = paymentApproved;
      req.session.paymentDetails = paymentDetails;

      res.redirect("/cart");

    } else {
      const paymentOrderId = req.session.orderId;
      let paymentStatus = "Approved";

      // fully approved
      if (payment.state === "approved") {
        paymentApproved = true;
        paymentStatus = "Paid";
        paymentMessage = "Your payment was successfully completed";
        paymentDetails = "<p><strong>Order ID: </strong>" + paymentOrderId + "</p><p><strong>Transaction ID: </strong>" + payment.id + "</p>";

        // clear the cart
        if (req.session.cart) {
          req.session.cart = null;
          req.session.orderId = null;
          req.session.cart.totalPrice = 0;
        }
      }
      res.flash("Success", "Your order has been placed");
      res.redirect("/");
    }

    // failed
    if (payment.failureReason) {
      paymentApproved = false;
      paymentMessage = "Your payment failed - " + payment.failureReason;
      paymentStatus = "Declined";
    }

    // update the order status
    Order.update({ _id: process.getId(paymentOrderId) }, { $set: { orderStatus: paymentStatus } }, { multi: false }, (err, numReplaced) => {
      if (err) {
        console.info(err.stack);
      }
      Order.findOne({ _id: query.getId(paymentOrderId) }, (err, order) => {
        if (err) {
          console.info(err.stack);
        }
      });
    });
  });
};
