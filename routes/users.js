const express = require("express");
const router = express.Router();
const passport = require("passport");

// import User controller
const userController = require("../controllers/userController");

/* GET users listing. */
router.post("/register", userController.memberRegister);
router.post("/login", userController.login);
router.get("/memeber-home", userController.memberHome);
router.get("/profile", userController.memberProfile);
router.get("/userOrders", userController.memberOrders);
router.get("/edit-profile", userController.memberProfileEdit);

module.exports = router;
