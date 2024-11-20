// Required Imports
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Candidate Schema
const candidateSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  currentLocation: { type: String, required: true },
  preferredLocation: { type: String, required: true },
  dob: { type: Date },
  gender: { type: String },
  aadhaarNumber: { type: String },
  panNumber: { type: String },
  totalExperience: { type: Number, required: true },
  relevantExperience: { type: Number, required: true },
  currentCompany: { type: String, required: true },
  noticePeriod: { type: Number, required: true },
  leavingReason: { type: String, required: true },
  noticePeriodComments: { type: String, required: true },
  currentSalary: { type: Number, required: true },
  expectedSalary: { type: Number, required: true },
  salaryStructure: { type: String },
  resume: {
    fileUrl: { type: String },
    uploadDate: { type: Date, default: Date.now },
  },
  jobId: { type: mongoose.Schema.ObjectId, ref: "Job" },
  submittedOn: { type: Date, default: Date.now },
});

// Candidate Model
const Candidate = mongoose.model("Candidate", candidateSchema);

// Export for Candidate Model
module.exports = Candidate;
