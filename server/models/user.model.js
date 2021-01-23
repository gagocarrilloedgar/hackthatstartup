const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: String,
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    jobs: [{ type: Schema.Types.ObjectId, ref: "Job" }],
    studies: [{ type: Schema.Types.ObjectId, ref: "Study" }],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
