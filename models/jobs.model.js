const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobsSchema = new Schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    current: { type: Boolean, default: false },
    headline: { type: String, required: true },
    description: { type: String, required: true },
    startDateM: { type: Number, required: true },
    startDateY: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobsSchema);
module.exports = Job;
