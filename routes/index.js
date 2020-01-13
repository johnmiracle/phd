const express = require("express");
const router = express.Router();
const passport = require("passport");

const indexController = require("../controllers/indexController");

/* GET home page. */
router.get("/", indexController.home);
router.get("/banners", indexController.banner);
router.get("/brouchures", indexController.brouchures);
router.get("/businesscards", indexController.businesscards);
router.get("/addtocart/:id", isLoggedIn, indexController.addCart);
router.get("/remove/:id", isLoggedIn, indexController.removeCart);
router.get("/cart", indexController.cart);
router.get("/contact", indexController.contact);
router.post('/contact-us', indexController.contact_us)
router.get("/gift", indexController.gift);
router.get("/stationary", indexController.stationary);
router.get("/mugs", indexController.mugs);
router.get("/custom-tskirt", indexController.tskirt);
router.get("/diary", indexController.diary);
router.get("/price", indexController.getprice);
router.get("/logo", indexController.logo);
router.get("/notes&jotter", indexController.notesJotter);
router.get("/ourWorks", indexController.ourWorks);
router.get("/letterhead", indexController.letterhead);
router.get("/promotionalItem", indexController.promotional);
router.get("/poster", indexController.poster);
router.get("/product", indexController.product);
router.get("/product/:id", indexController.productId);
router.get("/login", indexController.showLogin);
router.get("/logout", indexController.logout);
router.get("/register", indexController.signup);
router.get("/checkout", isLoggedIn, indexController.checkout);

module.exports = router;
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect("/login");
}

function isAdmin(req, res, next) {
  if (req.User.isAdmin) {
    req.flash("Danger", "You don't have the premission ");
    res.redirect(backURL);
  } else {
    next();
  }
}
