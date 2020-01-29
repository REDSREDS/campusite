Sites = require("../models/campusites")

// all middleware goes here
var middlewares = {};

// check if logged in, if not logged in, flash error.
middlewares.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        req.flash("error", "Login first please!");
        res.redirect("/login");
    }
};

// check if the site belongs to you
middlewares.isOwned = function(req, res, next) {
    if(req.isAuthenticated()) {
        Sites.findById(req.params.id, function(err, foundSite) {
            if(err) {
                req.flash("error", "Something is wrong");
                res.redirect("back");
            } else {
                if(foundSite.author.id.equals(req.user._id)) {
                    next();
                } else {
                    console.log("doesnot match");
                    req.flash("error", "Please stick to your own sites!");
                    res.redirect("/campusites");
                }
            }
        })
    } else {
        req.flash("error", "Login first please!");
        res.redirect("/login");
    }
};

module.exports = middlewares