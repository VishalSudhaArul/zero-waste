const mongoose = require("mongoose");

const pickupSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    volunteer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    wasteType: {
      type: String,
      enum: ["Plastic", "Organic", "E-Waste", "Metal", "Glass", "Other"],
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    quantity: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    preferredDate: {
      type: String,
      required: true
    },
    preferredTime: {
      type: String,
      required: true
    },
    contactNumber: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["Open", "Accepted", "Completed", "Cancelled"],
      default: "Open"
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pickup", pickupSchema);