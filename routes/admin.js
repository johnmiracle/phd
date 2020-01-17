const express = require("express");
const router = express.Router();
const upload = require("../config/multer");

const adminController = require("../controllers/adminCollector");

function isAdmin(req, res, next) {
  const backURL = req.header("Referer");

  if (req.user.isAdmin == true) {
    next();
  } else {
    req.flash("Danger", "You have no access");
    res.redirect(backURL);
  }
}
router.get("/cpanel", adminController.adminlogin);
router.post("/login", adminController.login);
router.get("/admin-home", isLoggedIn, isAdmin, adminController.adminHome);
router.get("/register", adminController.registerView);
router.post("/register", adminController.adminRegister);
router.get("/add-product", isLoggedIn, isAdmin, adminController.addproductpage);
router.post("/products/add", isLoggedIn, isAdmin, upload.single("myFile"), adminController.addproduct);
router.get("/add-category", isLoggedIn, isAdmin, adminController.addcategorypage);
router.post("/category/add", isLoggedIn, isAdmin, adminController.addcategory);
router.get("/all-products", isLoggedIn, isAdmin, adminController.products);
router.get("/all-categories", isLoggedIn, isAdmin, adminController.viewCategory);
router.get("/product/edit/:id", isLoggedIn, isAdmin, adminController.viewProductEdit);
router.post("/product/edit/:id", isLoggedIn, isAdmin, adminController.productEdit);
router.get("/category/edit/:id", isLoggedIn, isAdmin, adminController.viewCategoryEdit);
router.post("/category/edit/:id", isLoggedIn, isAdmin, adminController.categoryEdit);
router.get("/users", isLoggedIn, isAdmin, adminController.viewUsers);
router.delete("/product/delete/:id", isLoggedIn, isAdmin, adminController.product_delete);
router.get("/logout", adminController.logout);

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/admin/cPanel");
  req.flash("Danger", "Please sign in");
}
