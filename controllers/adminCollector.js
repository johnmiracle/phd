const bcrypt = require("bcryptjs");
const product = require("../models/Products");
const category = require("../models/Category");
const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const cloudinary = require("cloudinary").v2;
const { check, validationResult } = require("express-validator");

// require("../config/cloudinary");

require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});

exports.addproduct = async (req, res, next) => {
  const result = await cloudinary.uploader.upload(req.file.path);

  //create an New product
  const Product = new product();
  Product.name = req.body.name;
  Product.category = req.body.category._id;
  console.log(Product.category);
  Product.price = req.body.price;
  Product.image = result.secure_url;
  Product.description = req.body.description;
  Product.inStock = req.body.inStock;

  await Product.save(function(err) {
    // handle errors
    if (err) {
      req.flash("danger", err.message);
      console.log(err);
      res.redirect("/admin/add-product");
    } else {
      // no errors, return success message
      req.flash("Success", "Product has been added Successfully");
      // redirect to the add category view
      res.redirect("/admin/add-product");
    }
  }).catch(err => {
    req.flash("Danger", "Error upoading product, Try again");
  });
};

exports.addproductpage = (req, res, next) => {
  category.find({}, (err, category) => {
    if (err) {
      req.flash("Danger", "Unable to load Categories");
    } else {
      res.render("addProduct", { category });
    }
  });
};

exports.addcategorypage = (req, res, next) => {
  res.render("addCategory", { message: req.flash("success") });
};

exports.addcategory = (req, res, next) => {
  // create new category instance
  const Category = new category();
  // retrieve the Category name from the data sent over from the client
  Category.name = req.body.name;
  Category.description = req.body.description;
  Category.author = req.body.author;

  // save the category name to mongo
  Category.save(err => {
    // handle errors
    if (err) {
      req.flash("danger", err);
      res.redirect("/admin/add-category");
    } else {
      // no errors, return success message
      req.flash("success", "Successfully added a category");
      // redirect to the add category view
      return res.redirect("/admin/add-category");
    }
  });
};

exports.adminlogin = (req, res, next) => {
  res.render("adminLogin");
};

exports.login = (req, res, next) => {
  passport.authenticate("local", function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("danger", "Username & Password combination doesn't match any of our records");
      return res.redirect("/admin/cPanel");
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/admin/admin-home");
    });
  })(req, res, next);
};

exports.registerView = (req, res, next) => {
  res.render("adminReg");
};

exports.adminRegister = async (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const isAdmin = req.body.isAdmin;

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    req.flash("danger", "email is already registered, Please login");
    res.redirect("/admin/login");
  }

  check("firstName", "First name is required").notEmpty();
  check("lastName", "Last name is required").notEmpty();
  check("email", "email is required").isEmail();
  check("password", "Passsword is required")
    .trim()
    .notEmpty()
    .isLength({ min: 6 });

  let err = validationResult(req.body);

  if (!err.isEmpty()) {
    return res.flash({ err: err });
  } else {
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      isAdmin
    });
    bcrypt.hash(user.password, 10, (err, hash) => {
      user.password = hash;
      user.save(function(err) {
        if (err) {
          console.log(err);
        } else {
          req.flash("success", "Registration is successfull, Please Login");
          res.redirect("/admin/cPanel");
        }
      });
    });
  }
};

exports.adminHome = (req, res, next) => {
  res.render("adminHome");
};

exports.products = (req, res, next) => {
  product.find({}, (err, products) => {
    if (err) {
      req.flash("Danger", "Unable to load Products");
    } else {
      res.render("admin-product-view", { products });
    }
  });
};

exports.viewProductEdit = (req, res, next) => {
  product.findById(req.params.id, function(err, product) {
    if (err) return console.log(err);
    res.render("admin-product-edit", { product });
  });
};

exports.productEdit = (req, res, next) => {
  let Product = [];
  Product.name = req.body.name;
  // Product.category = req.body.category.name;
  Product.price = req.body.price;
  Product.description = req.body.description;
  Product.inStock = req.body.inStock;

  console.log(Product);
  let query = { _id: req.params.id };

  product
    .update(query, Product, function(err) {
      // handle errors
      if (err) {
        req.flash("danger", err.message);
        console.log(err);
        res.redirect("/admin/all-products");
      }
      if (product.Product === req.body) {
        res.redirect("/admin/all-products");
        req.flash("Success", "Product has been updated Successfully");
      } else {
        // no errors, return success message
        req.flash("Success", "Product has been updated Successfully");
        // redirect to the add category view
        res.redirect("/admin/all-products");
      }
    })
    .catch(err => {
      req.flash("Danger", "Error updating product, Try again");
    });
};

exports.product_delete = (req, res, next) => {
  let query = { _id: req.params.id };
  product.findByIdAndRemove(query, function(err) {
    if (err) {
      res.redirect("/admin/all-products");
      req.flash("Error", err.message);
    }
    req.flash("Deleted successfully!");
    res.redirect("/admin/all-products");
  });
};

exports.viewCategory = (req, res, next) => {
  category.find({}, (err, category) => {
    if (err) {
      req.flash("Danger", "Unable to load Categories");
    } else {
      res.render("admin-category", { category });
    }
  });
};

exports.viewCategoryEdit = (req, res, next) => {
  category.findById(req.params.id, function(err, category) {
    if (err) return console.log(err);
    res.render("admin-category-edit", { category });
  });
};

exports.categoryEdit = (req, res, next) => {
  let Category = [];
  Category.name = req.body.name;
  Category.description = req.body.description;

  let query = { _id: req.params.id };
  console.log(Category.description);

  category
    .update(query, Category, function(err) {
      // handle errors
      if (err) {
        req.flash("danger", err.message);
        console.log(err);
        res.redirect("/admin/all-categories");
      }
      if (category.Category === req.body) {
        res.redirect("/admin/all-categories");
        req.flash("Success", "Product has been updated Successfully");
      } else {
        // no errors, return success message
        req.flash("Success", "Product has been updated Successfully");
        // redirect to the add category view
        res.redirect("/admin/all-categories");
      }
    })
    .catch(err => {
      req.flash("Danger", "Error updating product, Try again");
    });
};

exports.viewUsers = (req, res, next) => {
  User.find({}, (err, users) => {
    if (err) {
      req.flash("Danger", "Unable to load Users");
    } else {
      res.render("admin-users", { users });
    }
  });
}

exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "You've successfully logged out");
  res.redirect("/admin/cPanel");
};
