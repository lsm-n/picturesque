var mongoose = require("mongoose");

var siteSchema = new mongoose.Schema({
    name: String,
    description: String,
    rating: Number,
    scores: [Number],
    location: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    photos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Photo"
        }
    
    ],
    comments: [
        { // this is saying that comments property should be an array of comment IDs.
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment" // the type of object the ID refers to
        }
    ]
});

var Site = mongoose.model("Site", siteSchema);


module.exports = Site;