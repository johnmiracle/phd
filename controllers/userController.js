const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const User = require("../models/User");
const Order = require("../models/Order");
const Cart = require("../models/cart");

function currencyFormat(num) {
  return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

exports.memberRegister = async (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const phone = req.body.phone;
  const password = req.body.password;
  const address = req.body.address;
  const audience = req.body.audience;
  const isAdmin = req.body.isAdmin;

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    req.flash("danger", "email is already registered, Please login");
    res.redirect("/login");
  }

  body("firstName", "First name is required").notEmpty();
  body("lastName", "Last name is required").notEmpty();
  body("email", "email is required").isEmail();
  body("phone", "Mobile Number is required").notEmpty();
  body("password", "Passsword is required")
    .trim()
    .notEmpty()
    .isLength({ min: 6 });
  check("address", "Address is required").notEmpty();

  let err = validationResult(req.body);

  if (!err.isEmpty()) {
    return res.flash({ err: err });
  } else {
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password,
      address,
      audience
    });
    bcrypt.hash(user.password, 10, (err, hash) => {
      user.password = hash;
      user.save(function(err) {
        if (err) {
          console.log(err);
        } else {
          req.flash("success", "Registration is successfull, Please Login");
          res.redirect("/login");
        }
        (req, res, next) => {
          if (req.session.oldUrl) {
            const oldUrl = req.session.oldUrl;
            req.session.oldUrl = null;
            res.redirect(oldUrl);
          }
        };
      });
    });
  }
};
exports.memberHome = (req, res, next) => {
  res.render("userHome");
};

exports.memberProfile = (req, res, next) => {
  res.render("memberProfile");
};

exports.memberProfileEdit = (req, res, next) => {
  User.findById(req.params.id, function(err, user) {
    if (err) return console.log(err);
    res.render("profile-edit", { user });
  });
};

exports.userProfileEdit = async (req, res, next) => {
  const user = await User.findOne({
    email: req.user.email
  });

  if (!user) {
    if (req.apiAuthenticated) {
      res.flash("danger", "User not found");
      return;
    }

    req.flash("danger", err.message);
    console.log(err);
    res.redirect("/users/profile");
    return;
  }

  const userData = {};
  userData.firstName = req.body.first_name;
  userData.lastName = req.body.last_name;
  userData.address = req.body.address;
  userData.phone = req.body.phone_number;
  userData.dob = req.body.dob;

  let query = { _id: req.params.id };

  User.update(query, userData, function(err) {
    // handle errors
    if (err) {
      req.flash("danger", err.message);
      console.log(err);
      res.redirect("/users/profile");
    }
    if (userData.User === req.body) {
      res.redirect("/users/profile");
      req.flash("Success", "User account updated");
    } else {
      // no errors, return success message
      req.flash("Success", "User account updated");
      // redirect to the add category view
      res.redirect("/users/profile");
    }
  });
};

exports.order_page = (req, res, next) => {
  Order.find({ user: req.user }, (err, orders) => {
    if (err) {
      res.flash("danger", "Error loading order, Please try again");
      res.redirect("/users/orders");
      return;
    } else {
      let orderProducts;
      orders.forEach(function(order) {
        orderProducts = new Cart(order.orderProducts);
        order.items = orderProducts.generateArray();
        console.log(order.orderProducts.items)
      });
      res.render("orders_page", { orders });
    }
  });
};

exports.view_order = async (req, res, next) => {
  const result = await Order.findById(req.params.id);

  Order.find({ _id: req.params.id }, function(err, orders) {
    let orderProducts;
    orders.forEach(function(order) {
      orderProducts = new Cart(order.orderProducts);
      order.item = orderProducts.generateArray();
      console.log(order.item);
      console.log("miracle");
      console.log(orderProducts);
    });
    res.render("order", { result, orders });
  });
};
