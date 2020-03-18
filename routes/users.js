const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isLogIn, isNotAdmin } = require("../controllers/authController");

// import User controller
const userController = require("../controllers/userController");

/* GET users listing. */
router.get("/member-home", isLogIn, isNotAdmin, userController.memberHome);
router.get("/profile", isLogIn, isNotAdmin, userController.memberProfile);
router.get("/edit-profile/:id", isLogIn, isNotAdmin, userController.memberProfileEdit);
router.post("/edit/:id", isLogIn, isNotAdmin, userController.userProfileEdit);
router.post("/register", isLogIn, isNotAdmin, userController.memberRegister);
router.get("/orders", isLogIn, isNotAdmin, userController.order_page);
router.get("/order/view/:id", isLogIn, isNotAdmin, userController.view_order);
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  function(req, res, next) {
    if (req.session.oldUrl) {
      const oldUrl = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(oldUrl);
    } else {
      res.redirect("/");
    }
  }
);

module.exports = router;
