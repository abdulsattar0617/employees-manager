module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged to do this!");

    return res.redirect("/login");
  }

  next();
};
