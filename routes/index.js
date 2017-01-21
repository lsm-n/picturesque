var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Site = require("../models/site");
var passport = require("passport");

// homepage redirect 
router.get("/", function(req, res) {
    res.redirect("/sites");
    //res.render("home");
});

// search
router.get("/search", function(req, res) {
    var regex = new RegExp(req.query.q, 'i');  // 'i' makes query non case-sensitive
    Site.find({name: regex}).populate("photos").exec(function(err, foundSites) {
        if (err || foundSites == "") {
            req.flash("error", "Could not find any sites named \'" + req.query.q + "\'");
            res.redirect("/sites");
        } else {
            res.render("results.ejs", {sites: foundSites});
        }
    });
});

// register
router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username, profilePicture: req.body.profilePicture, description: req.body.description}); // create new user w username
    var password = req.body.password; // password is separate argument, it gets hashed
    User.register(newUser, password, function(err, user){
        if (err) {
          req.flash("error", err.message);
          res.redirect("/register");
            console.log(err);
        } else {
            // logs user in, runs serialize user
            passport.authenticate("local")(req, res, function() {
                req.flash("success", "Welcome to picturesque, " + req.body.username + "!");
                res.redirect("/sites");
            });
        }
    });
});

//login
router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/sites",
    failureRedirect: "/loginFailure"
    }),function(req, res){
});

router.get("/loginFailure", function(req, res) {
    req.flash("error", "Incorrect username or password");
    res.redirect("/login");
})

// logout
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "You are now logged out");
    res.redirect("/sites");
});


// to export routes
module.exports = router;