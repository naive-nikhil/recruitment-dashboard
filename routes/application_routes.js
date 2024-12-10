const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedIn } = require("../middlewares.js");
const Candidate = require("../models/candidate.js");
const Job = require("../models/job.js");
const wrapAsync = require("../utils/wrapAsync.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.get("/", async (req, res) => {
  const { companyId, jobId } = req.params;
  const candidates = await Candidate.find({ jobId });
  const job = await Job.findById(jobId);
  res.render("applications/applications.ejs", {
    candidates,
    companyId,
    jobId,
    jobRole: job.role,
  });
});

router.get("/add", async (req, res) => {
  const { companyId, jobId } = req.params;
  const job = await Job.findOne({ _id: jobId });
  const experienceRequired = job.experienceRequired;
  const role = job.role;
  const location = job.location;
  res.render("applications/addApplicationForm.ejs", {
    companyId,
    jobId,
    experienceRequired,
    role,
    location,
  });
});

router.post(
  "/",
  upload.single("candidate[resume]"),
  wrapAsync(async (req, res) => {
    const { jobId } = req.params;
    const resumeUrl = req.file.path;
    let newCandidate = new Candidate(req.body.candidate);
    newCandidate.resume.fileUrl = resumeUrl;
    newCandidate.jobId = jobId;

    await Job.findByIdAndUpdate(jobId, {
      $addToSet: { profiles: newCandidate._id },
    });
    await newCandidate.save();
    res.redirect("/");
  })
);

module.exports = router;
