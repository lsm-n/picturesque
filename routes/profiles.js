var express = require("express");
var router = express.Router({mergeParams: true});
var User = require("../models/user");
var Site = require("../models/site");
var Photo = require("../models/photo");
var middleware = require("../middleware");

//user profile
router.get("/", function(req, res){
    User.findById(req.params.id).populate("photos").exec(function(err, user) {
        if (err) {
            console.log(err);
        } else {
            // found all photos by this author
            Photo.find({"author.id": req.params.id}, function(err, photos) {
                if (err) {
                    console.log(err);
                } else {
                    
                    var siteInfo = new Array();
                    
                    photos.forEach(function(photo) {
                        Site.find({photos: {$in: [photo._id]}}, function(err, sites) {
                            if (err) { 
                                console.log(err);
                            } else {
                                sites.forEach(function(site) {
                                    siteInfo.push({"name": site.name, "id": site._id});
                                });
                            }
                        });
 
                    });
                    res.render("users/profile", {user: user, photos: photos});
                }
            });
            
        }
    });
});

// edit
router.get("/edit", middleware.checkProfileAuth, function (req, res) {
    
    User.findById(req.params.id, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            res.render("users/edit", {user: user});
        }
    });
});

// update
router.put("/", middleware.checkProfileAuth, function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser) {
        if (err) {
            console.log(err);
        } else {
            req.flash("success", "Changes to your profile have been saved");
            res.redirect("/user/" + req.params.id);
            
        }
    });
});

// to export routes
module.exports = router;