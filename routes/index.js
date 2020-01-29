var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


// sign up
router.get("/register", function(req,res) {
    res.render("register");
})

router.post("/register", function(req,res) {
    User.register(new User({username:req.body.username}), req.body.password, function(err, user) {
        if(err) {
            req.flash("error", err.message);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Sign Up completed!")
            res.redirect("/campusites")
        });
    })
})

// login
router.get("/login", function(req,res) {
    res.render("login")
})

router.post("/login",passport.authenticate("local", {
    successRedirect:"/campusites",
    failureRedirect:"/login",
    failureFlash:true
}), function(req,res) {
});

// logout
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Successfully logout!")
    res.redirect("/");
})

module.exports=router;