const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["user", "volunteer", "admin"],
    required: true
  },
  location: {
    type: String,
    default: ""
  },
  skills: {
    type: [String],
    default: []
  },
  interests: {
    type: [String],
    default: []
  },
  phone: {
    type: String,
    default: ""
  },
  bio: {
    type: String,
    default: ""
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  status: {
  type: String,
  enum: ["active", "suspended"],
  default: "active"
}
});

module.exports = mongoose.model("User", userSchema);