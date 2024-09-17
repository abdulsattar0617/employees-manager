const express = require("express");
const connectDB = require("./DBConnection");
const app = express();
const port = 3000;
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");
const employeesRouter = require("./routes/employee");
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./Models/user");
const userRouter = require("./routes/user");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// use ejs-locals for all ejs templates:
app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// serve the static files - public dir
app.use(express.static(path.join(__dirname, "/public")));

app.use(methodOverride("_method"));

// Session options
const sessionOptions = {
  secret: "mysupersecretkey",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 3 * 24 * 60 * 60 * 1000,
    maxAge: 3 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

connectDB();

// session
app.use(session(sessionOptions));

// Flash message middleware
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.username = req.flash("username");
  next();
});

// Passport (login)
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/employees", employeesRouter);
app.use("/", userRouter);

// Non existing paths
app.all("*", (req, res, next) => {
  throw new ExpressError(404, "Page Not Found!");
});

// Standard Error Handler
app.use((err, req, res, next) => {
  let { status = 500, message = "Something broke!" } = err;

  res.status(status).render("employees/error.ejs", { message });
});

app.listen(port, () => {
  console.log(`server listening on port ${port}...`);
});
