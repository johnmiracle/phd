const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const passport = require("passport");
const bcrypt = require("bcryptjs");

// import Models
const User = require("../models/User");

// import User controller
const userController = require("../controllers/userController");

/* GET users listing. */
router.post("/register", userController.memberRegister);

router.post("/login", userController.login);

router.get("/profile", (req, res, next) => {
  res.render("memberProfile");
});

router.get("/userOrders", (req, res, next) => {
  res.render("");
});

module.exports = router;
