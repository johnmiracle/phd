const express = require("express");
const router = express.Router();
const passport = require("passport");

// import User controller
const userController = require("../controllers/userController");

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

/* GET users listing. */
router.get("/memeber-home", isLoggedIn, userController.memberHome);
router.get("/profile", isLoggedIn, userController.memberProfile);
router.get("/userOrders", isLoggedIn, userController.memberOrders);
router.get("/edit-profile", isLoggedIn, userController.memberProfileEdit);
router.post("/register", userController.memberRegister);
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  function (req, res, next) {
    if (req.session.oldUrl) {
      const oldUrl = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(oldUrl);
    } else {
      res.redirect("/users/memeber-home");
    }
  }
);

module.exports = router;
