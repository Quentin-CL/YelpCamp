// Si on est en mode developpement alors on va chercher les info du fichier env (variable d'environnement)
import { } from 'dotenv/config'
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import ejsMate from 'ejs-mate';
import ExpressError from "./utils/ExpressError.js";
import methodOverride from 'method-override';
import session from 'express-session';
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local";
import User from './models/user.js';



import campgroundRoutes from './routes/campgrounds.js';
import reviewRoutes from './routes/reviews.js';
import userRoutes from './routes/users.js';


mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Database connected");
});


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: "thisshouldbeabettersecret!",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,  // For security
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// Method of authentication (local = mail + password)
passport.use(new LocalStrategy(User.authenticate()));

// Tell how to store and unstore a user
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes)

app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong';
    res.status(statusCode).render("error", { err });
})




app.listen(3000, () => {
    console.log("Listening on port 3000")
})