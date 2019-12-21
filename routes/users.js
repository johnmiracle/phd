const express = require("express");
const router = express.Router();
const passport = require("passport");

// import User controller
const userController = require("../controllers/userController");

/* GET users listing. */
router.post("/register", userController.memberRegister);
router.post("/login", userController.login);
router.get("/memeber-home", isLoggedIn, userController.memberHome);
router.get("/profile", isLoggedIn, userController.memberProfile);
router.get("/userOrders",isLoggedIn, userController.memberOrders);
router.get("/edit-profile", isLoggedIn,userController.memberProfileEdit);

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}