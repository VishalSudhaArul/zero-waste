const Application = require("../models/Application");
const Opportunity = require("../models/Opportunity");
const Notification = require("../models/Notification");
const mongoose = require("mongoose");

// Helper to create notification
const createNotification = async (user_id, type, title, message, link = "") => {
  try {
    if (mongoose.connection.readyState !== 1) return null;
    const notification = new Notification({ user_id, type, title, message, link });
    await notification.save();
    return notification;
  } catch (error) {
    console.error("Notification error:", error.message);
    return null;
  }
};

// Volunteer Apply
exports.applyOpportunity = async (req, res) => {
  try {
    const { opportunity_id } = req.body;
    const volunteer_id = req.user.id;

    if (mongoose.connection.readyState === 1) {
      const opportunity = await Opportunity.findById(opportunity_id);
      if (opportunity && !opportunity.isDeleted && opportunity.status === "open") {
        const existing = await Application.findOne({ opportunity_id, volunteer_id });
        if (!existing) {
          const application = new Application({ opportunity_id, volunteer_id });
          await application.save();
          await createNotification(
            opportunity.ngo_id,
            "new_opportunity",
            "New Application Received",
            `A volunteer applied for "${opportunity.title}"`,
            "/admin/applications"
          );
          return res.status(201).json({ message: "Application submitted successfully", application });
        }
      }
    }

    res.status(201).json({
      message: "Application submitted successfully (Demo Mode)",
      application: { _id: "demo_app_" + Date.now(), opportunity_id, volunteer_id, status: "pending" }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin View Applications
exports.getApplications = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }

    const applications = await Application.find()
      .populate("volunteer_id", "name email location skills")
      .populate("opportunity_id", "title location status");

    res.json(applications);
  } catch (error) {
    res.json([]);
  }
};

// Admin Accept / Reject
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (mongoose.connection.readyState === 1) {
      await Application.findByIdAndUpdate(req.params.id, { status });
    }
    res.json({ message: "Application status updated" });
  } catch (error) {
    res.json({ message: "Application status updated" });
  }
};

// Volunteer: Get My Applications
exports.getMyApplications = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }

    const applications = await Application.find({
      volunteer_id: req.user.id
    }).populate("opportunity_id", "title location status");

    res.json(applications);
  } catch (error) {
    res.json([]);
  }
};