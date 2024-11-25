require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Candidate = require("./models/candidate");
const Job = require("./models/job");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const multer = require("multer");
const { storage } = require("./cloudConfig.js");
const upload = multer({ storage });
const wrapAsync = require("./utils/wrapAsync.js");
const CustomError = require("./utils/CustomError.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const { isLoggedIn } = require("./middlewares.js");

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;
const DB_URL = process.env.DB_URL;

main()
  .then(() => console.log("DB Connection Successful!"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(DB_URL);
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

app.get("/", isLoggedIn, (req, res) => {
  res.redirect("/jobs");
});

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.currUser = req.user;
  next();
});

app.get(
  "/jobs",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const jobs = await Job.find({}).populate("profiles");
    res.render("jobs", { jobs });
  })
);

// Job Posting
app.post(
  "/jobs",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    await new Job(req.body.job).save();
    req.flash("success", "Job posted successfully!");
    res.redirect("/jobs");
  })
);

app.delete(
  "/jobs/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Job.findByIdAndDelete(id);
    req.flash("success", "Job deleted successfully!");
    res.redirect("/jobs");
  })
);

app.get(
  "/applications",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const candidates = await Candidate.find({}).populate("jobId");
    res.render("applications", { candidates });
  })
);

app.post(
  "/applications/:jobId",
  isLoggedIn,
  upload.single("candidate[resume]"),
  wrapAsync(async (req, res) => {
    const { jobId } = req.params;
    const resumeUrl = req.file.path;
    console.log(req.body);
    let newCandidate = new Candidate(req.body.candidate);
    newCandidate.resume.fileUrl = resumeUrl;
    newCandidate.jobId = jobId;

    await Job.findByIdAndUpdate(jobId, {
      $addToSet: { profiles: newCandidate._id },
    });
    await newCandidate.save();
    res.redirect("/jobs");
  })
);

app.get("/signup", (req, res) => {
  res.render("user.ejs", { formType: "signUpForm" });
});

app.get("/login", (req, res) => {
  res.render("user.ejs", { formType: "loginForm" });
});

// Register User
app.post(
  "/signup",
  wrapAsync(async (req, res) => {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    await User.register(newUser, password);
    req.flash("success", "User registered successfully");
    res.redirect("/");
  })
);

// Login User
app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(async (req, res) => {
    req.flash("success", "Login successful");
    res.redirect("/");
  })
);

// Logout User
app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/login");
  });
});

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
