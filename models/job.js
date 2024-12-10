// Required Imports
const mongoose = require("mongoose");
const Company = require("./company");
const { required } = require("joi");
const Schema = mongoose.Schema;

// Requisition Schema
const jobSchema = new Schema({
  role: { type: String, required: true },
  experienceRequired: { type: String, required: true },
  location: { type: String, required: true },
  positions: { type: Number, required: true, default: 1 },
  budget: { type: Number, required: true },
  submittedOn: { type: Date, default: Date.now },
  jobDescription: { type: String, required: true },
  companyId: { type: mongoose.Schema.ObjectId, ref: "Company", required: true },
  profiles: [{ type: mongoose.Schema.ObjectId, ref: "Candidate", default: {} }],
});

// Requisition Model
const Job = mongoose.model("Job", jobSchema);

// Export for Requisition Model
module.exports = Job;
