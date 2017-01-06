var mongoose = require("mongoose");

var photoSchema = new mongoose.Schema({
    link: String,
    caption: String,
    author: { 
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Photo"
        },
        username: String
    }
});

var Photo = mongoose.model("Photo", photoSchema);

module.exports = Photo;