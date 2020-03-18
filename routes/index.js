const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");
const { isLogIn, isNotAdmin } = require("../controllers/authController");

/* GET home page. */
router.get("/", isNotAdmin, indexController.home);
router.get("/banners", isNotAdmin, indexController.banner);
router.get("/brouchures", isNotAdmin, indexController.brouchures);
router.get("/businesscards", isNotAdmin, indexController.businesscards);
router.get("/addtocart/:id", isNotAdmin, indexController.addCart);
router.get("/addbyone/:id", isNotAdmin, indexController.addOne);
router.get("/reducebyone/:id", isNotAdmin, indexController.removeOne);
router.get("/remove/:id", isNotAdmin, indexController.removeCart);
router.get("/cart", isNotAdmin, indexController.cart);
router.get("/contact", isNotAdmin, indexController.contact);
router.post("/contact-us", isNotAdmin, indexController.contact_us);
router.get("/gift", isNotAdmin, indexController.gift);
router.get("/stationary", isNotAdmin, indexController.stationary);
router.get("/mugs", isNotAdmin, indexController.mugs);
router.get("/custom-tskirt", isNotAdmin, indexController.tskirt);
router.get("/diary", isNotAdmin, indexController.diary);
router.get("/price", isNotAdmin, indexController.getprice);
router.get("/logo", isNotAdmin, indexController.logo);
router.get("/notes&jotter", isNotAdmin, indexController.notesJotter);
router.get("/ourWorks", isNotAdmin, indexController.ourWorks);
router.get("/letterhead", isNotAdmin, indexController.letterhead);
router.get("/promotionalItem", isNotAdmin, indexController.promotional);
router.get("/poster", isNotAdmin, indexController.poster);
router.get("/product", isNotAdmin, indexController.product);
router.get("/product/:id", isNotAdmin, indexController.productId);
router.get("/login", isNotAdmin, indexController.showLogin);
router.get("/logout", isNotAdmin, indexController.logout);
router.get("/register", isNotAdmin, indexController.signup);
router.get("/checkout", isNotAdmin, isLogIn, indexController.checkout);
router.get("/checkout_cancel", isNotAdmin, isLogIn, indexController.checkout_cancel);
router.get("/checkout_return", isNotAdmin, isLogIn, indexController.checkout_return)
router.post("/pay", isNotAdmin, isLogIn, indexController.checkout_action);
router.post('/paystack/pay', isNotAdmin, indexController.payStack)
router.get("/payment_return", isNotAdmin, isLogIn, indexController.payment_return);



module.exports = router;
