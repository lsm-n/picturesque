// required imports
var express = require("express");
var router = express.Router(); // add routes onto router instead of app
var Site = require("../models/site");
var Photo = require("../models/photo");
var middleware = require("../middleware"); // automatically requires index.js

// for creating photos
router.get("/:id/newphoto", middleware.isLoggedIn, function( req, res) {
    Site.findById(req.params.id, function(err, site) {
        if(err) {
            console.log(err);
        } else {
            res.render("photos/new", {site: site});
        }
    });
});

router.post("/:id", middleware.isLoggedIn, function (req, res) {
    Site.findById(req.params.id, function(err, site) {
        if (err) {
            console.log(err);
        } else {
            var newPhoto = req.body.photo;
            
            Photo.create(newPhoto, function(err, photo) {
                if (err) {
                    console.log(err);
                } else {
                    photo.author.username = req.user.username;
                    photo.author.id = req.user._id;
                    
                    photo.save();
                    site.photos.push(photo);
                    site.save();
                    
                    //console.log(site);
                    res.redirect("/sites/" + req.params.id);
                    
                }
            });
        }
    });
    
});

// to export routes
module.exports = router;