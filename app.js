require("dotenv").config();
var express = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    User = require("./models/user")
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    PassportLocalMongoose = require("passport-local-mongoose"),
    Comments = require("./models/comments"),
    methodOverride = require("method-override"),
    flash = require("connect-flash"),
    seed = require("./seed");

// mongoose.connect("mongodb://localhost:27017/campusites", {useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect("mongodb+srv://max:HUANhuan123@cluster0-ognw1.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex:true
}).then(() => {
    console.log("connected to DB");
}).catch(err => {
    console.log("error", err.message);
});


var app = express();
const port = process.env.PORT || 3000;

var commentRoutes = require("./routes/comments"),
    campusiteRoutes = require("./routes/campusites"),
    authenRoutes = require("./routes/index");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("imgs"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(flash());
app.use(require("express-session")({
    secret:"hello",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(methodOverride("_method"));
app.locals.moment = require("moment");


app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


// seed();

app.use(commentRoutes);
app.use(campusiteRoutes);
app.use(authenRoutes);


app.listen(port,function() {
    console.log("The server has started");
});
