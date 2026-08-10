const mongoose = require("mongoose");

const adminLogSchema = new mongoose.Schema(
  {
    admin_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    action: {
      type: String,
      required: true
    },
    target_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    details: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminLog", adminLogSchema);