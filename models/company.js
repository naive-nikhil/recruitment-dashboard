// Required Imports
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Candidate Schema
const companySchema = new Schema({
  companyName: { type: String, required: true },
  industry: { type: String, required: true },
  contactPersonName: { type: String, required: true },
  contactPersonPhone: { type: Number, required: true },
  contactPersonEmail: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
  jobs: [{ type: mongoose.Schema.ObjectId, ref: "Candidate", default: {} }],
});

// Candidate Model
const Company = mongoose.model("Company", companySchema);

// Export for Candidate Model
module.exports = Company;
