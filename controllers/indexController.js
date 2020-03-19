const Product = require("../models/Products");
const Category = require("../models/Category");
const Order = require("../models/Order");
const passport = require("passport");
const Cart = require("../models/cart");
const paypal = require("paypal-rest-sdk");
const axios = require("axios").default;

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
  const products = await Product.find({}).populate("category");
  res.render("brouchures", { products });
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
    console.log(cart);
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
  function currencyFormat(num) {
    return "₦" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }
  res.render("checkout", {
    products: cart.generateArray(),
    totalPrice: currencyFormat(cart.totalPrice)
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

  // create payment
  paypal.payment.create(create_payment_json, function(error, payment) {
    if (error) {
      req.flash("Danger", "There was an error processing your payment. You have not been changed and can try again.");
      res.redirect("/pay");
      return;
    }
    req.session.paymentId = payment.id;
    let redirectUrl;
    for (let i = 0; i < payment.links.length; i++) {
      const link = payment.links[i];
      if (link.method === "approval_url") {
        redirectUrl = link.href;
      }
    }
    // for (let i = 0; i < payment.links.length; i++) {
    //   if (payment.links[i].rel === "approval_url") {
    //     res.redirect(payment.links[i].href);
    //   }
    // }

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
      orderTotal: cart.totalPrice,
      orderEmail: req.body.shipEmail,
      orderNames: req.body.shipFullname,
      orderAddress: req.body.shipAddr1,
      orderCountry: req.body.shipCountry,
      orderState: req.body.shipState,
      orderPostcode: req.body.shipPostcode,
      orderPhone: req.body.shipPhoneNumber,
      orderStatus: payment.state,
      orderDate: new Date(),
      cart: req.session.cart
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
      res.redirect("/checkout");
    } else {
      res.flash("Success", "Your order has been placed");
      res.redirect("/");
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
    }
  });
};

exports.payStack = (req, res, next) => {
  const cart = new Cart(req.session.cart);
  axios({
    method: "post",
    url: "https://api.paystack.co/transaction/initialize/",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.paystack_secret_key
    },
    data: {
      amount: cart.totalPrice * 100,
      email: req.body.shipEmail,
      first_name: req.body.shipFirstname,
      last_name: req.body.shipLastName,
      cartid: "" + Math.floor(Math.random() * 1000000000 + 1),
      currency: "NGN",
      MobileNumber: req.body.shipPhoneNumber
    }
  })
    .then(response => {
      let reference = response.data.data.reference;
      // new order doc
      const orderDoc = new Order({
        user: req.user,
        orderPaymentId: reference,
        orderPaymentGateway: "PayStack",
        orderTotal: cart.totalPrice,
        orderEmail: req.body.shipEmail,
        orderFirstName: req.body.shipFirstname,
        orderLastName: req.body.shipLastname,
        orderAddress: req.body.shipAddr1,
        orderCountry: req.body.shipCountry,
        orderState: req.body.shipState,
        orderPostcode: req.body.shipPostcode,
        orderPhone: req.body.shipPhoneNumber,
        orderStatus: "",
        orderGatewayResponse: "",
        orderComment: req.body.shipOrderComment,
        orderDate: new Date(),
        orderProducts: req.session.cart
      });

      orderDoc.save(err => {
        if (err) {
          console.info(err.stack);
        } else {
          // handle success
          res.redirect(response.data.data.authorization_url);
          return;
        }
      });
    })
    .catch(function(error) {
      // handle error
      req.flash("Danger", "There was an error processing your payment. You have not been changed and can try again.");
      res.redirect("/checkout");
      console.log(error);
      return;
    });
  return;
};

exports.payment_return = (req, res, next) => {
  const cart = new Cart(req.session.cart);
  const reference = req.query.reference;

  const url = "https://api.paystack.co/transaction/verify/" + reference;

  return axios
    .get(url, {
      headers: {
        Authorization: process.env.paystack_secret_key
      },
      data: {
        reference: reference
      }
    })
    .then(response => {
      let order = [];
      order.orderStatus = response.data.data.gateway_response;
      order.orderGatewayResponse = response.data.data.gateway_response;

      console.log(response.data.data.gateway_response);
      let query = { orderPaymentId: reference };

      Order.update(query, order, function(err) {
        // handle errors
        if (err) {
          req.flash("danger", err.message);
          console.log(err);
          res.redirect("");
        }
        // set cart to empty
        req.session.cart = null;
        res.render("order_successful", { reference });
        return;
      });
    })
    .catch(function(error) {
      // handle error
      req.flash("Danger", "There was an error verifying your payment.");
      res.redirect("/checkout");
      console.log(error);
      return;
    });
};
