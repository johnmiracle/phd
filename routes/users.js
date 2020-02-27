const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isLogIn, isNotUser } = require("../controllers/authController");

// import User controller
const userController = require("../controllers/userController");

/* GET users listing. */
router.get("/member-home", isLogIn, isNotUser, userController.memberHome);
router.get("/profile", isLogIn, isNotUser, userController.memberProfile);
router.get("/edit-profile", isLogIn, isNotUser, userController.memberProfileEdit);
router.post("/register", isLogIn, isNotUser, userController.memberRegister);
router.get("/orders", isLogIn, isNotUser, userController.order_page);
router.get('/order/view/:id', isLogIn, isNotUser, userController.view_order)
router.post("/login",passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}),
  function(req, res, next) {
    if (req.session.oldUrl) {
      const oldUrl = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(oldUrl);
    } else {
      res.redirect("/users/member-home");
    }
  }
);

module.exports = router;
