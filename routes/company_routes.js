const express = require("express");
const router = express.Router();
const Company = require("../models/company.js");
const Job = require("../models/job.js");

router.get("/", async (req, res) => {
  const companies = await Company.find({});
  res.render("companies/companies.ejs", { companies });
});

router.get("/add", (req, res) => {
  res.render("companies/addCompanyForm.ejs");
});

router.post("/", async (req, res) => {
  await new Company(req.body.company).save();
  req.flash("success", "Company added successfully!");
  res.redirect("/");
});

module.exports = router;
