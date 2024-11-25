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
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const session = require("express-session");
const flash = require("connect-flash");

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

app.get("/", (req, res) => {
  res.redirect("/jobs");
});

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  next();
});

app.get("/jobs", async (req, res) => {
  const jobs = await Job.find({}).populate("profiles");
  res.render("jobs", { jobs });
});

// Job Posting
app.post(
  "/jobs",
  wrapAsync(async (req, res) => {
    await new Job(req.body.job).save();
    req.flash("success", "Job posted successfully!");
    res.redirect("/jobs");
  })
);

app.delete("/jobs/:id", async (req, res) => {
  let { id } = req.params;
  await Job.findByIdAndDelete(id);
  res.redirect("/jobs");
});

app.get(
  "/applications",
  wrapAsync(async (req, res) => {
    const candidates = await Candidate.find({}).populate("jobId");
    res.render("applications", { candidates });
  })
);

app.post(
  "/applications/:jobId",
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
