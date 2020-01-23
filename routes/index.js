const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");
const { isAdmin, isLoggedIn, isLogIn } = require("../controllers/authController");

/* GET home page. */
router.get("/", indexController.home);
router.get("/banners", indexController.banner);
router.get("/brouchures", indexController.brouchures);
router.get("/businesscards", indexController.businesscards);
router.get("/addtocart/:id", indexController.addCart);
router.get("/addbyone/:id", indexController.addOne);
router.get("/reducebyone/:id", indexController.removeOne);
router.get("/remove/:id", indexController.removeCart);
router.get("/cart", indexController.cart);
router.get("/contact", indexController.contact);
router.post("/contact-us", indexController.contact_us);
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
router.get("/checkout", isLogIn, indexController.checkout);
router.post("/checkout_action", isLogIn, indexController.checkout_action);

router.get("/checkingout", indexController.checkoutPage);
router.post("/checkOUT", indexController.check);

module.exports = router;
