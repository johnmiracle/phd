module.exports = {
  isLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash("Danger", "Please sign in to continue");
      res.redirect("/admin/cpanel");
    }
  },

  isLogIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.session.oldUrl = req.url;
      req.flash("Danger", "Please sign in to continue");
      res.redirect("/login");
    }
  },

  isNotAdmin: (req, res, next) => {
    if (req.isAuthenticated() && req.user.isAdmin == true) {
      req.flash("Danger", "You have no access");
      res.redirect("/admin/admin-home");
    } else {
      next();
    }
  },

  isAdmin: (req, res, next) => {
    if (req.user.isAdmin == true) {
      next();
    } else {
      req.flash("Danger", "You have no access");
      res.redirect("/users/member-home");
    }
  }
};
