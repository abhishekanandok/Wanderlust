if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
};



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");



// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("error in MONGO session STORE", err);
});

//session code
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};



app.get("/", (req, res) => {
    res.redirect("/listings"); //home page
});



const Card = mongoose.model('listing', { title: String, location: String /* other fields */ }); // Define your MongoDB model

app.use(express.json());

// Route for fetching suggestions based on entered text
app.get('/search', async (req, res) => {
  const searchTerm = req.query.q; // Get the search term from the query parameter

  try {
    // Perform a case-insensitive search on the 'title' field using regex
    const result = await Card.find({ title: { $regex: searchTerm, $options: 'i' } })
      .limit(8) // Limit the number of suggestions (adjust as needed)
      .select('title'); // Select only the 'title' field

    res.json(result); // Return the search suggestions as JSON
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Route to fetch location options from the 'listing' collection
app.get('/locations', async (req, res) => {
    try {
      const locations = await Card.distinct('location');
      console.log(locations);
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });



app.use(session(sessionOptions));
app.use(flash());//route se pahale use kare

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; //send data to ejs user name and password
    next();
});



app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


//error handling middlewares
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err; //default message assigned, if nothing
    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode).send(message);
});






app.listen(8080, () => {
    console.log("server is listening to port 8080");
});
