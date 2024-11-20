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

app.get("/", (req, res) => {
  res.redirect("/jobs");
});

app.get("/jobs", async (req, res) => {
  const jobs = await Job.find({});
  res.render("jobs", { jobs });
});

app.post("/jobs", async (req, res) => {
  await new Job(req.body.job).save();
  res.redirect("/jobs");
});

app.delete("/jobs/:id", async (req, res) => {
  let { id } = req.params;
  await Job.findByIdAndDelete(id);
  res.redirect("/jobs");
});

app.get("/applications", async (req, res) => {
  const candidates = await Candidate.find({}).populate("jobId");
  res.render("applications", { candidates });
});

app.post(
  "/applications/:jobId",
  upload.single("candidate[resume]"),
  async (req, res) => {
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
  }
);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`App is listening to PORT:${PORT}`);
});
