var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var seedData = [
    {
        name: "Cueva Espiral, Puerto Rico",
        image: "http://68.media.tumblr.com/7e1f29ea6e84bd898453004b6447a968/tumblr_oi4t23RryZ1rwhluao2_r1_1280.png",
        description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro"
    },
    {
        name: "Cascada La Nutria, Chile",
        image: "http://68.media.tumblr.com/3ca86bd2804473d480a5578964271464/tumblr_of9ndjfYjx1rwhluao1_1280.png",
        description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro"
    },
    {
        name: "Iguazu Falls, Argentina",
        image: "http://68.media.tumblr.com/101c17049580f8df6a5e5cfc7f4d5f68/tumblr_of7mlsGyFR1rwhluao2_1280.png",
        description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro"
    },
    {
        name: "Tengah Beach, Malaysia",
        image: "http://68.media.tumblr.com/d027e1b6c6d177eec64ff0869338b370/tumblr_ocp4cbRwlq1rwhluao1_1280.png",
        description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro"
    }
]

function seedDB () {
    //remove campgrounds
    Campground.remove({}, function(err) {
        if (err) {
            console.log(err)
        } else {
            console.log("removed all campgrounds");
            
            //add a few campgroudns
            seedData.forEach(function(seed) {
                Campground.create(seed, function(err, campground){
                  if (err) {
                      console.log(err);
                  } else {
                      //console.log("ADDED NEW CAMPGROUND:");
                      //console.log(campground);   
                      
                      //add a new comments
                      Comment.create(
                          {
                              text: "A nice place!",
                              author: { username: "Bubba"}
                          }, function(err, comment) {
                              if(err) {
                                  console.log(err);
                              } else {
                                campground.comments.push(comment);
                                campground.save();
                                //console.log("Created new comment!");
                              }
                          });
                      
                      
                  }
                }); 
            });
        }
    });
    
    
}

module.exports = seedDB; //sends out the seedDB function!