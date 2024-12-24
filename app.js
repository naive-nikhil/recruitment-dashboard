require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Company = require("./models/company");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const { isLoggedIn } = require("./middlewares.js");

const jobsRouter = require("./routes/job_routes.js");
const applicationsRouter = require("./routes/application_routes.js");
const usersRouter = require("./routes/user_routes.js");
const companiesRouter = require("./routes/company_routes.js");

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;
const DB_URL = process.env.DB_URL;

main()
  .then(() => console.log("DB Connection Successful!"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(DB_URI);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);

app.use(
  session({
    secret: "yourSecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.currUser = req.user;
  next();
});

app.get("/", (req, res) => {
  res.render("index");
});

app.use("/companies", companiesRouter);
app.use("/companies/:companyId/jobs", jobsRouter);
app.use("/companies/:companyId/jobs/:jobId/applications", applicationsRouter);
app.use("/", usersRouter);

app.use((err, req, res, next) => {
  console.log(err.stack);
  let { status = 500, message = "Oops! Some error occurred!" } = err;
  console.log("I reached Here");
  res.status(status).render("error", { status, message });
});

app.use((req, res) => {
  res.status(404).render("pagenotfound.ejs");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`App is listening to PORT:${PORT}`);
});
