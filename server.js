// imports
const express = require("express") //importing express package
const app = express() // creates a express application
const dotenv = require("dotenv").config() //this allows me to use my .env values in this file
const morgan = require('morgan')
const session = require('express-session');
const methodOverride = require('method-override')
const {MongoStore} = require("connect-mongo");
const connectToDB = require('./db.js')
// middleware imports
const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");
const isAdmin = require("./middleware/is-admin");

// controller Imports
const authController = require("./controllers/auth.controllers.js");
const indexController = require("./controllers/index.controllers.js");
const movieController = require("./controllers/movie.controllers.js");
const showtimeController = require("./controllers/showtime.controllers.js");
// const snackController = require("./controllers/snack.controllers.js");
const bookingController = require("./controllers/booking.controllers.js");
const hallController = require("./controllers/hall.controllers.js");


// Middleware
app.use(express.static('public')) // my app will serve all static files from public folder
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'))
app.use(methodOverride('_method'))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,

    store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: "sessions"
    }),

    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
  })
);
app.use(passUserToView)

// Track the current path to highlight the active navigation link
app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    next();
});












// Routes go here
app.use('/auth',authController)
app.use('/',indexController)
app.use('/movies',movieController)
app.use('/showtimes', isAdmin, showtimeController)
// app.use('/snacks', snackController)
app.use('/bookings', isSignedIn, bookingController)
app.use('/halls', isAdmin, hallController)






// connect to database and listen on Port 3000
async function startServer() {
    const PORT = process.env.PORT || 3000;
    await connectToDB();

    app.listen(PORT, () => {
        console.log(`App is running on port ${PORT}`);
    });
}

startServer();