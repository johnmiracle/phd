const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const passport = require("passport");
const session = require("express-session");
const validate = require("express-validator");
const cloudinary = require("cloudinary").v2;

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const adminRouter = require("./routes/admin");

const app = express();

// .env setup
require("dotenv").config();

console.log(process.env.MIRACLE);

// mongoDb setup
mongoose.set("useCreateIndex", true);
mongoose
  .connect(process.env.Database, { useNewUrlParser: true, autoReconnect: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// models
require("./models/User");
require("./models/Products");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "/public")));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Express session middleware
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SECRET
  })
);

// Connect-flash middleware
app.use(require("connect-flash")());
app.use(function(req, res, next) {
  res.locals.flashes = req.flash();
  next();
});

// flash
app.use(flash());

// passport
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// locals
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
