const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studiesSchema = new Schema(
  {
    school: { type: String, required: true },
    degree: { type: String, required: true },
    fieldOfStudy: { type: String, required: true },
    grade: { type: String, required: true },
    startDateM: { type: Number, required: true },
    startDateY: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Study = mongoose.model("Study", studiesSchema);
module.exports = Study;
