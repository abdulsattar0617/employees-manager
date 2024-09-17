const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../Models/user");
const passport = require("passport");

// GET : logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    res.locals.user = {};
    req.flash("success", "you are logged out!");
    res.redirect("/login");
  });
});

// POST : login
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  wrapAsync(async (req, res) => {
    req.flash("username", req.user.username);
    req.flash(
      "success",
      `Welcome back ${req.user.username || "to Admin Portal"}!`
    );
    res.redirect("/employees");
  })
);

// GET : login
router.get(
  "/login",
  wrapAsync(async (req, res) => {
    res.render("users/login.ejs");
  })
);

// POST : sign up
router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    let { username, password } = req.body;

    let user = new User({
      username,
    });

    let registeredUser = await User.register(user, password);

    console.dir(registeredUser);

    req.flash("success", "New user registed!");
    res.redirect("/login");
  })
);

// GET : sign up
router.get(
  "/signup",
  wrapAsync(async (req, res) => {
    res.render("users/signup.ejs");
  })
);

module.exports = router;
