// required imports
var express = require("express");
var router = express.Router(); // add routes onto router instead of app
var Site = require("../models/site");
var Photo = require("../models/photo");
var middleware = require("../middleware"); // automatically requires index.js

// index
router.get("/", function(req, res) {
    Site.find({}).populate("photos").exec(function(err, sites){
        if (err) {
            req.flash("error", err.message);
            res.redirect("/sites");
        } else {
            res.render("sites/sites", {sites: sites});
        }
    });
});

// new 
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("sites/new");
});

// create
router.post("/", middleware.isLoggedIn, function(req, res) {
   var name = req.body.name;
   var description = req.body.description;
   var rating = req.body.score; //when site is first creating, rating is the initial score
   var score = req.body.score;
   var location = req.body.location;
   var author = {
                id: req.user.id,
                username: req.user.username
            };
   var newSite = {name: name, description: description, rating: rating, location: location, author: author};
   
   if (rating == null) {
       req.flash("error", "Please remember to select an initial rating the site");
       res.redirect("sites/new");
   } else {
   
       Site.create(newSite, function(err, site){
          if (err) {
              req.flash("error", "This site could not be created");
              res.redirect("/sites");
          } else {
             var newPhoto = req.body.photo;
             Photo.create(newPhoto, function(err, photo) {
                if (err) {
                    req.flash("error", "This site could not be created");
                    res.redirect("/sites");
                } else {
                    photo.author.username = req.user.username;
                    photo.author.id = req.user._id;
                        
                    photo.save();
                    site.photos.push(photo);
                    
                    site.scores.push(score);
                    
                    site.save();
                    
                    req.flash("success", site.name + " has been added");
                    res.redirect("/sites/" + site._id);
                }
            });
          }
        });
   }
});


// show
router.get("/:id", function(req, res) {
    Site.findById(req.params.id).populate("photos").populate("comments").exec(function(err, site) {
        if (err) {
            req.flash("error", "This site could not be found");
            res.redirect("/sites");
        } else {
            res.render("sites/show", {site: site});
        }
    });

});

// rate
router.put("/:id/rate", middleware.isLoggedIn, function (req, res) {
    var score = req.body.score;
    
    Site.findById(req.params.id, function(err, site) {
        if (err) {
            req.flash("error", "This site could not be found");
            res.redirect("/sites");
        } else {
            site.scores.push(score);
            
            // avgs. new score into overall rating
            var total = 0;
            for (var i = 0; i < site.scores.length; i++) {
               total = total + site.scores[i]; 
            }
            site.rating = total/site.scores.length;
            site.save();
            
            req.flash("success", "Your rating of " + site.name + " has been saved");
            res.redirect("/sites/" + req.params.id);
            
        }
    });
});

// edit
router.get("/:id/edit", middleware.checkSiteAuth, function (req, res) {
    Site.findById(req.params.id, function(err, site) {
        if (err) {
            req.flash("error", "This site could not be found");
            res.redirect("/sites");
        } else {
            res.render("sites/edit", {site: site});
        }
    });
});

// update
router.put("/:id", middleware.checkSiteAuth, function (req, res) {
    Site.findByIdAndUpdate(req.params.id, req.body.site, function(err, updatedSite) {
        if (err) {
            req.flash("error", "This site could not be updated");
            res.redirect("/sites");
        } else {
            req.flash("success", "Changes to " + updatedSite.name + " have been saved");
            res.redirect("/sites/" + req.params.id);
            
        }
    });
});


//delete a campground
router.delete("/:id", middleware.checkSiteAuth, function (req, res) {
    Site.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            req.flash("error", "This site could not be deleted");
            res.redirect("/sites");
        } else {
            req.flash("success", "Your site has been deleted");
            res.redirect("/sites");
        }
    });
});

// to export routes
module.exports = router;