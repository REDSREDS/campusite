var express = require("express");
var router = express.Router();
var Sites = require("../models/campusites");
var Comments = require("../models/comments");
var middleware = require("../middleware");

// direct to new comment webpage
router.get("/campusites/:id/comments/new", middleware.isLoggedIn, function(req, res) {
    Sites.findById(req.params.id, function(err, foundSite) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {site:foundSite});
        }
    })
})

// post comment to campusite
router.post("/campusites/:id/comments", function(req, res) {
    Sites.findById(req.params.id, function(err, foundSite) {
        if(err) {
            req.flash("error", "somthing is wrong!");
            res.redirect("/campusites")
        } else {
            Comments.create(new Comments({
                text: req.body.text,
                author : {
                    id: req.user._id,
                    username: req.user.username
                }
            }), function(err, comment) {
                if(err) {
                    console.log(err);
                } else {
                    foundSite.comments.push(comment);
                    foundSite.save();
                    req.flash("sucess", "comment added");
                    res.redirect("/campusites/" + foundSite._id);
                }
            })
        }
    })
})


module.exports = router;