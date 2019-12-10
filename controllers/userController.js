const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("User");

exports.memberRegister = async (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const phone = req.body.phone;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const address = req.body.address;
  const audience = req.body.audience;

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    req.flash("danger", "email is already registered, Please login");
    res.redirect("/login");
  }

  check("firstName", "First name is required").notEmpty();
  check("lastName", "Last name is required").notEmpty();
  check("email", "email is required").isEmail();
  check("phone", "Mobile Number is required").notEmpty();
  check("password", "Passsword is required").notEmpty();
  check("confirmPassword", "Passwords is does not match")
    .equals(req.body.password)
    .isLength({ min: 5 });
  check("address", "Address is required").notEmpty();

  let err = validationResult(req);

  if (!err.isEmpty()) {
    return res.flash({ err: err });
  } else {
    let user = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      password: password,
      address: address,
      audience: audience
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
      });
    });
  }
};

exports.login = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/users/profile",
    failureRedirect: "/login",
    failureFlash: true
  })(req, res, next);
};
