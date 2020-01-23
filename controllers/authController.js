module.exports = {
  isLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash("Danger", "Your Session has expired, Please sign in");
      res.redirect("/admin/cpanel");
    }
  },

  isLogIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.session.oldUrl = req.url;
    req.flash("Danger", "Your Session has expired, Please sign in");
    res.redirect("/login");
  },

  isAdmin: (req, res, next) => {
    const backURL = req.header("Referer");

    if (req.user.isAdmin == true) {
      next();
    } else {
      req.flash("Danger", "You have no access");
      res.redirect(backURL);
    }
  }
};
