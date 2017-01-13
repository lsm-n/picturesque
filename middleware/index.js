var middlewareObj = {};

var Site = require("../models/site");
var Comment = require("../models/comment");
var User = require("../models/user");

middlewareObj.checkSiteAuth = function(req, res, next) {
    if (req.isAuthenticated()) { // check that user is logged in
        Site.findById(req.params.id, function(err, site) {
            if (err) {
                req.flash("error","This site could not be found");
                res.redirect("/sites");
            } else { // if campground is found
                if (site.author.id.equals(req.user._id)) { // check ownership
                    next(); 
                } else { // if they don't have ownership
                    req.flash("error","Permission denied");
                    res.redirect("/sites/"+req.params.id);
                }
            }
        });
    } else {
        req.flash("error", "You must be logged in to do that");
        res.redirect("/sites/"+req.params.id);
    }
};

middlewareObj.checkCommentAuth = function(req, res, next) {
    if (req.isAuthenticated()) { // check that user is logged in
        Comment.findById(req.params.comment_id, function(err, comment) {
            if (err) {
                req.flash("error","This review could not be found");
                res.redirect("/sites/"+req.params.id);
            } else {
                if (comment.author.id.equals(req.user._id)) { // check ownership
                    next(); 
                } else { // if they don't have ownership
                    req.flash("error","Permission denied");
                    res.redirect("/sites/"+req.params.id);
                }
                
            }
        });
    } else {
        req.flash("error", "You must be logged in to do that");
        res.redirect("/sites/"+req.params.id);
    }
};

middlewareObj.checkProfileAuth = function(req, res, next) {
    if (req.isAuthenticated()) { // check that user is logged in
        User.findById(req.params.id, function(err, user) {
            if (err) {
                req.flash("error","User could not be found");
                res.redirect("/user/"+req.params.id);
            } else { // if campground is found
                if (user._id.equals(req.user._id)) { // check ownership
                    next(); 
                } else { // if they don't have ownership
                    req.flash("error","Permission denied");
                    res.redirect("/user/"+req.params.id);
                }
                
            }
        });
    } else {
        req.flash("error", "You must be logged in to do that");
        res.redirect("/user/"+req.params.id);
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You must be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj;