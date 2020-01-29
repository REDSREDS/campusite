var express = require("express");
var router = express.Router();
var Sites = require("../models/campusites");
var middleware = require("../middleware");
var multer = require("multer");
var storage = multer.diskStorage({
    filename:function(req, file, callback) {
        callback(null, Date.now() + file.originalname);
    },
    limits: {
        files: 1,
        fileSize: 1024 * 1024
    }
})
var imageFilter = function(req, file, cb) {
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
        return cb(new Error("only image files area allowed"), false);
    }
    cb(null, true);
}

var upload = multer({storage: storage, fileFilter: imageFilter});

var cloudinary = require("cloudinary");
cloudinary.config({
    cloud_name: "dpf8fec4l",
    api_key: "227967261194314",
    api_secret: "-HORMneZP_ECug8k2FZJEmctpP4"
})


router.get("/", function(req, res) {
    res.render("landing");
});

router.get("/campusites", function(req, res) {
    Sites.find({}, function(err, sites) {
        if(err) {
            console.log(err);
        } else {
            res.render("campusites/campusites", {sites:sites});
        }
    });
});

router.get("/campusites/new", middleware.isLoggedIn, function(req,res) {
    res.render("campusites/new");
});

router.get("/campusites/:id", function(req,res) {
    Sites.findById(req.params.id).populate("comments").exec(function(err, foundSite) {
        if(err) {
            console.log(err);
        } else {
            res.render("campusites/show", {site : foundSite});
        }
    })
});

router.post("/campusites", middleware.isLoggedIn, upload.single("image"), function(req, res) {
    var newSite = req.body.site;
    cloudinary.uploader.upload(req.file.path, function(result) {
        var newSite = req.body.site;
        newSite.img = result.secure_url;
        newSite.imgId = result.public_id;
        newSite.author = {
            id: req.user._id,
            username: req.user.username
        };
        console.log(newSite);
        Sites.create(newSite, function(err, site) {
            if(err) {
                console.log(err);
            } else {
                req.flash("success", "New site is created!");
                res.redirect("/campusites");
            }
        });
    });
})

// edit campusite
router.get("/campusites/:id/edit",middleware.isOwned, function(req, res) {
    Sites.findById(req.params.id, function(err, foundSite) {
        res.render("campusites/edit", {site:foundSite});
    })
})

// update campusite
router.put("/campusites/:id",middleware.isOwned, upload.single("image"), function(req, res) {
    Sites.findById(req.params.id, function(err, ToUpdate) {
        if(err) {
            console.log(err);
            res.redirect("back");
        } else {
            if(req.file) {
                cloudinary.uploader.destroy(ToUpdate.imgId, function() {
                        req.flash("success", "finished replacing image");
                });
                cloudinary.uploader.upload(req.file.path, function(result) {
                    console.log("is uploading");
                    ToUpdate.img = result.secure_url;
                    ToUpdate.imgId = result.public_id;
                    ToUpdate.name = req.body.site.name;
                    ToUpdate.campus = req.body.site.campus;
                    ToUpdate.body = req.body.site.body;
                    console.log(ToUpdate);
                    ToUpdate.save();
                    req.flash("success", "Edit completed!");
                    res.redirect("/campusites/" + req.params.id);
                });
            } else {
                ToUpdate.name = req.body.site.name;
                ToUpdate.campus = req.body.site.campus;
                ToUpdate.body = req.body.site.body;
                console.log(ToUpdate);
                ToUpdate.save();
                req.flash("success", "Edit completed!");
                res.redirect("/campusites/" + req.params.id);
            }
        }
    });
})

// delete campusite
router.delete("/campusites/:id",middleware.isOwned, function(req, res) {
    Sites.findByIdAndRemove(req.params.id, function(err, ToDelete) {
        cloudinary.uploader.destroy(ToDelete.imgId, function() {
            req.flash("success", "finished replacing image");
    });
        req.flash("success", "Delete completed!")
        res.redirect("/campusites");
    })
})

module.exports = router;