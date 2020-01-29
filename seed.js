var mongoose = require("mongoose"),
    Sites = require("./models/campusites"),
    Comments = require("./models/comments"),
    Users = require("./models/user");


function seedDB() {
    Comments.remove({}, function(err) {
        if(err) {
            console.log(err);
        }
    })
    Sites.remove({}, function(err) {
        if(err) {
            console.log(err);
        } 
    })
    Users.remove({}, function(err) {
        if(err) {
            console.log(err);
        } 
    })
    
}


module.exports = seedDB;
