// Model
const product = require("../models/Products");
const category = require("../models/Category");
const cloudinary = require("cloudinary").v2;

const uploads = require("../handlers/multer");

require("../config/cloudinary");
require("dotenv").config();

exports.addproduct = async (req, res, next) => {
  uploads(req, res, err => {
    if (err) {
      req.flash("Error");
    }
    req.flash("file uploaded");
  });

  await cloudinary.uploader.upload(req.file.image.path, function(result) {
    console.log(req.file);

    
    const Product = new product();
    Product.name = req.body.name;
    Product.category = req.body.category;
    Product.price = req.body.price;
    Product.image = result.url;
    console.log(result);

    Product.description = req.body.description;
    Product.inStock = req.body.inStock;

    console.log("miracle");

    Product.save(function(err) {
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
    });
  });

  // let imgUrl = "";

  // cloudinary.uploader.upload(req.files.image.path, resultImage => {
  //   console.log("Product Cloud Image URL:\t" + resultImage.url);
  //   imgUrl = resultImage.url;
  //   console.log("img url value:\t" + imgUrl);

  //   Products.findOne({ slug: slug })
  //     .select("_id title slug image desc price category")
  //     .exec()
  //     .then(product => {
  //       if (product) {
  //         req.flash("danger", "Product Title Already Exists");
  //         res.render("admin/add_product", {
  //           title: title,
  //           slug: slug,
  //           price: price,
  //           desc: desc,
  //           category: cat,
  //           image: imgUrl
  //         });
  //       } else {
  //         // start reading from here... sorry had to include the other parts above
  //         console.log("Unique Product Slug");

  //         let price2 = parseFloat(price).toFixed(2);

  //         let product = new Products({
  //           title: title,
  //           slug: slug,
  //           price: price2,
  //           desc: desc,
  //           category: cat,
  //           image: imgUrl
  //         });

  //         product
  //           .save()
  //           .then(data => {
  //             console.log("Product Created:\t" + data);

  //             req.flash("success", "New Product Created");
  //             res.redirect("/admin/products");
  //           })
  //           .catch(e => {
  //             console.error("Error Saving Product:\t" + e);
  //           });
  //       }
  //     })
  //     .catch(err => {
  //       console.error(err);
  //     });
  // });
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
