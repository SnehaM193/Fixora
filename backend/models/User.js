const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true },
  email: String,
  role: { type: String, enum: ["user", "vendor"], default: "user" },
});

module.exports = mongoose.model("User", userSchema);
