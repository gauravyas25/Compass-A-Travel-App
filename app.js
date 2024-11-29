if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const express  = require("express");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
//const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/expressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
app.use(methodOverride("_method"));
app.set("views", path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
// const Listing = require("./models/listing.js");
// const Review = require("./models/review.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const usersRouter = require("./routes/users.js");
const mongoose = require('mongoose');
const cookie = require("express-session/session/cookie.js");
// const {isLoggedIn} = require("./middleware.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/AirBnB";

main().then(()=> {
    console.log("connection successfull")}).catch(err => console.log(err));
async function main() {
  await mongoose.connect(MONGO_URL);
}


app.listen(port, () =>{
    console.log("app working");
});

// app.get("/", (req,res) => {
//     res.send("root");
// });




const sessionOpt = {
    secret : "mysecret",
    resave : false,
    saveUninitialized : true,
    cookie :{
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    },
};

app.use(session(sessionOpt));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    console.log(res.locals.success);
    next();
});





// app.get("/demouser", async(req, res, next) => {
//     let fakeUser = new User({
//         email : "asdeda@gmail.com",
//         username : "asdadasxs"
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });








app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", usersRouter);




app.all("*", (req, res, next) =>{
    next(new ExpressError(404, "Page Not Found!"));
});


app.use((err, req, res, next) => {
    let {status = 500, message = "Something Went Wrong"} = err;
    res.status(status).send(message);
    // res.status(status).render("Error.ejs", {message});
});





// app.get("/testListings", async (req,res) => {
//     let sampleListing = new Listing({
//         title: "My home",
//         description: "My place",
//         // image: "https://www.igms.com/wp-content/uploads/2017/12/airbnb-photos.pic3_.jpeg",
//         price: 10000,
//         location: "Pune",
//         country: "India"
//     });

//     await sampleListing.save();
//     console.log("Sample saved");
//     res.send("Successful");
// });