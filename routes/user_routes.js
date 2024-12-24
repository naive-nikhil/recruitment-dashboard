const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("user.ejs", { formType: "signUpForm" });
});

router.get("/login", (req, res) => {
  res.render("user.ejs", { formType: "loginForm" });
});

// Register User
router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    await User.register(newUser, password);
    req.flash("success", "User registered successfully");
    res.redirect("/");
  })
);

// Login User
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(async (req, res) => {
    req.flash("success", "Login successful");
    res.redirect("/");
  })
);

// Logout User
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/login");
  });
});

module.exports = router;
