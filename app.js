require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Candidate = require("./models/candidate");
const Job = require("./models/job");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

const PORT = process.env.PORT || 8080;
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

app.get("/applications", (req, res) => {
  res.render("applications");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`App is listening to PORT:${PORT}`);
});
