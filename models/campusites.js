mongoose = require("mongoose");

// schema for site
var siteSchema = new mongoose.Schema({
    name:String,
    img:String,
    imgId:String,
    campus:String,
    body: String,
    createdAt:{
        type:Date,
        default: Date.now
    },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"comments"
        }
    ],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username: String
    }
});

module.exports = mongoose.model("site", siteSchema);