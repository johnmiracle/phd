// Product Model
const product = require("../models/Products");
const category = require("../models/Category");

exports.addproduct = (req, res, next) => {
  const Product = new product();
  Product.name = req.body.name;
  Product.category = req.body.category;
  Product.price = req.body.price;
  Product.image = req.body.image;
  Product.description = req.body.description;
  Product.inStock = req.body.inStock;

  Product.save(function(err) {
    // handle errors
    if (err) {
      // req.flash("danger", err);
      console.log(err);
      res.redirect("/admin/add-product");
    } else {
      // no errors, return success message
      req.flash("Success", "Product has been added Successfully");
      // redirect to the add category view
      res.redirect("/admin/add-product");
    }
  });
};

exports.addproductpage = (req, res, next) => {
  res.render("addProduct");
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

  console.log(req.body.name);
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
