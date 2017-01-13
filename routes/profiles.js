var express = require("express");
var mongoose = require("mongoose");
var router = express.Router({mergeParams: true});
var User = require("../models/user");
var Site = require("../models/site");
var Photo = require("../models/photo");
var middleware = require("../middleware");

//user profile
router.get("/", function(req, res){
    User.findById(req.params.id).populate("photos").exec(function(err, user) {
        if (err) {
            req.flash("error", "This user could not be found");
            res.redirect("/sites");
        } else {
            // found all photos by this author
            Photo.find({"author.id": req.params.id}, function(err, photos) {
                if (err) {
                    req.flash("error", "Some photos belonging to this user could not be found");
                    res.redirect("/user/" + req.params.id);
                } else {
                    var site_names = [];
                    var site_ids = [];
                    var photosProcessed = 0;
                    photos.forEach(function(photo) {
                        Site.find({photos: mongoose.Types.ObjectId(photo._id)}, function(err, site) {
                            if (err) {
                                req.flash("error", "Some photos belonging to this user could not be found");
                                res.redirect("/user/" + req.params.id);
                            } else {
                                if (site == false) {
                                    site_names.push("Site Removed");
                                    site_ids.push("");  
                                } else {
                                    site_names.push(site[0].name);
                                    site_ids.push(site[0]._id);
                                }
                                
                                photosProcessed++;
                                
                                if (photos.length === photosProcessed) {
                                    res.render("users/profile", {user: user, photos: photos, 
                                    site_names: site_names, site_ids: site_ids});
                                }
                            }
                        });
                        
                    });
                }
            });
            
        }
    });
});

// edit
router.get("/edit", middleware.checkProfileAuth, function (req, res) {
    User.findById(req.params.id, function(err, user) {
        if (err) {
            req.flash("error", "This user could not be found");
            res.redirect("/sites");
        } else {
            res.render("users/edit", {user: user});
        }
    });
});

// update
router.put("/", middleware.checkProfileAuth, function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser) {
        if (err) {
            req.flash("error", "Changes to your profile could not be saved");
            res.redirect("/user/" + req.params.id);
        } else {
            req.flash("success", "Changes to your profile have been saved");
            res.redirect("/user/" + req.params.id);
            
        }
    });
});

// to export routes
module.exports = router;