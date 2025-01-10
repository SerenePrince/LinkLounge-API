const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // Enforce unique usernames
      trim: true, // Trim whitespace from the username
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure emails are unique
      trim: true, // Trim whitespace from the email
    },
    password: {
      type: String,
      required: true,
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
