const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedIn } = require("../middlewares.js");
const Job = require("../models/job.js");
const Company = require("../models/company.js");
const wrapAsync = require("../utils/wrapAsync.js");

router.get("/", async (req, res) => {
  const { companyId } = req.params;
  const jobs = await Job.find({ companyId });
  const company = await Company.findOne({ _id: companyId });
  res.render("jobs/jobs.ejs", {
    jobs,
    companyId,
    companyName: company.companyName,
  });
});

router.get("/add", (req, res) => {
  const { companyId } = req.params;
  res.render("jobs/addJobForm.ejs", { companyId });
});

router.get("/:jobId/viewJD", async (req, res) => {
  const { jobId } = req.params;
  const job = await Job.findOne({ _id: jobId });
  jobDescription = job.jobDescription;
  res.render("jobs/viewJDForm.ejs", { jobDescription, jobId });
});

router.post("/", async (req, res) => {
  const { companyId } = req.params;
  let newJob = new Job(req.body.job);
  newJob.companyId = companyId;
  await newJob.save();
  req.flash("success", "Job posted successfully!");
  res.redirect("/");
});

router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Job.findByIdAndDelete(id);
    req.flash("success", "Job deleted successfully!");
    res.redirect("/jobs");
  })
);

module.exports = router;
