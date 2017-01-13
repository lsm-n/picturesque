// required imports
var express = require("express");
var router = express.Router({mergeParams: true});
var Site = require("../models/site");
var Comment = require("../models/comment");
var middleware = require("../middleware"); // automatically requires index.js

// new comment
router.get("/new", middleware.isLoggedIn, function(req, res) {
   Site.findById(req.params.id, function(err, site){
       if (err) {
            req.flash("error", "This site could not be found");
            res.redirect("/sites");
           console.log(err);
       } else {
           res.render("comments/new", {site: site});
       }
   });
});

// create comment
router.post("/", middleware.isLoggedIn, function(req, res) {
    Site.findById(req.params.id, function(err, site){
       if (err) {
            req.flash("error", "This site could not be found");
            res.redirect("/sites");
       } else { // add new comment to correct campground
           var newComment = req.body.comment;
           Comment.create(newComment, function(err, comment) {
               if (err) {
                   req.flash("error", "Your review could not be created");
                   res.redirect("/sites/" + req.params.id);
                   console.log(err);
               } else {
                   comment.author.username = req.user.username;
                   comment.author.id = req.user._id;
                   // save comment
                   comment.save();
                   
                   site.comments.push(comment); //push created comment to found campground
                   site.save(); //save campground
                   
                   req.flash("success", "Your review has been added");
                   res.redirect("/sites/"+ req.params.id); //redirect to original campground
               }
           });
       }
    });
   
});

//edit
router.get("/:comment_id/edit", middleware.checkCommentAuth, function(req, res) {
    var site_id = req.params.id;
    var comment_id = req.params.comment_id;
    Comment.findById(comment_id, function(err, comment) {
        if (err) {
            req.flash("error", "This review could not be found");
            res.redirect("/sites/" + req.params.id);
        } else {
            res.render("comments/edit", {site_id: site_id, comment: comment});
        }
        
    });
});

//update
router.put("/:comment_id", middleware.checkCommentAuth, function(req, res) {
    var comment_id = req.params.comment_id;
    var site_id = req.params.id;
    Comment.findByIdAndUpdate(comment_id, req.body.comment, function (err, comment) {
        if (err) {
            req.flash("error", "Your review could not be updated");
            res.redirect("/sites/" + req.params.id);
        } else {
            req.flash("success", "Your review has been updated");
            res.redirect("/sites/" + site_id);
        }
    });
});

//destroy

router.delete("/:comment_id", middleware.checkCommentAuth, function(req, res) {
    var comment_id = req.params.comment_id;
    var site_id = req.params.id;
    
    Comment.findByIdAndRemove(comment_id, function (err) {
        if (err) {
            req.flash("error", "This review could not be deleted");
            res.redirect("/sites/" + req.params.id);
        } else {
            req.flash("success", "Your review has been deleted");
            res.redirect("/sites/" + site_id);
        }
    });
});


// to export routes
module.exports = router;