const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");
const { isLogIn, isNotUser } = require("../controllers/authController");

// router.use(isNotUser);

/* GET home page. */
router.get("/", isNotUser, indexController.home);
router.get("/banners", isNotUser, indexController.banner);
router.get("/brouchures", isNotUser, indexController.brouchures);
router.get("/businesscards", isNotUser, indexController.businesscards);
router.get("/addtocart/:id", isNotUser, indexController.addCart);
router.get("/addbyone/:id", isNotUser, indexController.addOne);
router.get("/reducebyone/:id", isNotUser, indexController.removeOne);
router.get("/remove/:id", isNotUser, indexController.removeCart);
router.get("/cart", isNotUser, indexController.cart);
router.get("/contact", isNotUser, indexController.contact);
router.post("/contact-us", isNotUser, indexController.contact_us);
router.get("/gift", isNotUser, indexController.gift);
router.get("/stationary", isNotUser, indexController.stationary);
router.get("/mugs", isNotUser, indexController.mugs);
router.get("/custom-tskirt", isNotUser, indexController.tskirt);
router.get("/diary", isNotUser, indexController.diary);
router.get("/price", isNotUser, indexController.getprice);
router.get("/logo", isNotUser, indexController.logo);
router.get("/notes&jotter", isNotUser, indexController.notesJotter);
router.get("/ourWorks", isNotUser, indexController.ourWorks);
router.get("/letterhead", isNotUser, indexController.letterhead);
router.get("/promotionalItem", isNotUser, indexController.promotional);
router.get("/poster", isNotUser, indexController.poster);
router.get("/product", isNotUser, indexController.product);
router.get("/product/:id", isNotUser, indexController.productId);
router.get("/login", isNotUser, indexController.showLogin);
router.get("/logout", isNotUser, indexController.logout);
router.get("/register", isNotUser, indexController.signup);
router.get("/checkout", isNotUser, isLogIn, indexController.checkout);
router.get("/checkout_cancel", isNotUser, isLogIn, indexController.checkout_cancel);
router.get("/checkout_return", isNotUser, isLogIn, indexController.checkout_return)
router.post("/pay", isNotUser, isLogIn, indexController.checkout_action);

module.exports = router;
