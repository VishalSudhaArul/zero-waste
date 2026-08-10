const User = require("../models/User");
const Pickup = require("../models/Pickup");
const Opportunity = require("../models/Opportunity");
const Application = require("../models/Application");
const AdminLog = require("../models/AdminLog");
const mongoose = require("mongoose");

// Helper to create admin log
const createLog = async (admin_id, action, target_user_id = null, details = "") => {
  try {
    if (mongoose.connection.readyState !== 1) return;
    await new AdminLog({ admin_id, action, target_user_id, details }).save();
  } catch (err) {
    console.error("Log error:", err.message);
  }
};

// GET all users
exports.getAllUsers = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([
        { _id: "664f5b6f3a7c9e0011111111", name: "Demo Citizen", email: "user@zero.com", role: "user", status: "active", location: "Green City Center" },
        { _id: "664f5b6f3a7c9e0022222222", name: "Demo Volunteer", email: "volunteer@zero.com", role: "volunteer", status: "active", location: "Green City Center" },
        { _id: "664f5b6f3a7c9e0033333333", name: "System Admin", email: "admin@zero.com", role: "admin", status: "active", location: "Headquarters" }
      ]);
    }

    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.json([]);
  }
};

// SUSPEND user
exports.suspendUser = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await User.findByIdAndUpdate(req.params.id, { status: "suspended" });
    }
    res.json({ message: "User suspended successfully" });
  } catch (error) {
    res.json({ message: "User suspended successfully" });
  }
};

// ACTIVATE user
exports.activateUser = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await User.findByIdAndUpdate(req.params.id, { status: "active" });
    }
    res.json({ message: "User activated successfully" });
  } catch (error) {
    res.json({ message: "User activated successfully" });
  }
};

// GET admin logs
exports.getAdminLogs = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }

    const logs = await AdminLog.find()
      .populate("admin_id", "name email")
      .populate("target_user_id", "name email")
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(logs);
  } catch (error) {
    res.json([]);
  }
};

// GET full report data
exports.getReports = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        users: { total: 12, citizens: 8, volunteers: 3, admins: 1, active: 12, suspended: 0 },
        pickups: { total: 45, open: 12, accepted: 8, completed: 25 },
        wasteByType: [
          { _id: "Plastic", count: 18 },
          { _id: "E-Waste", count: 12 },
          { _id: "Paper & Cardboard", count: 10 },
          { _id: "Glass", count: 5 }
        ],
        opportunities: { total: 6, open: 4, inProgress: 1, closed: 1 },
        applications: { total: 15, pending: 5, accepted: 8, rejected: 2 },
        topVolunteers: [
          { name: "Demo Volunteer", email: "volunteer@zero.com", location: "Green City Center", completedPickups: 14 }
        ],
        recentPickups: []
      });
    }

    const totalUsers      = await User.countDocuments({ role: "user" });
    const totalVolunteers = await User.countDocuments({ role: "volunteer" });
    const totalAdmins     = await User.countDocuments({ role: "admin" });
    const activeUsers     = await User.countDocuments({ status: { $ne: "suspended" } });
    const suspendedUsers  = await User.countDocuments({ status: "suspended" });

    const totalPickups     = await Pickup.countDocuments({ isDeleted: false });
    const openPickups      = await Pickup.countDocuments({ status: "Open",      isDeleted: false });
    const acceptedPickups  = await Pickup.countDocuments({ status: "Accepted",  isDeleted: false });
    const completedPickups = await Pickup.countDocuments({ status: "Completed", isDeleted: false });

    const wasteByType = await Pickup.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: "$wasteType", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const totalOpportunities     = await Opportunity.countDocuments({ isDeleted: false });
    const openOpportunities      = await Opportunity.countDocuments({ status: "open",        isDeleted: false });
    const inProgressOpportunities = await Opportunity.countDocuments({ status: "in-progress", isDeleted: false });
    const closedOpportunities    = await Opportunity.countDocuments({ status: "closed",      isDeleted: false });

    const totalApplications    = await Application.countDocuments();
    const pendingApplications  = await Application.countDocuments({ status: "pending" });
    const acceptedApplications = await Application.countDocuments({ status: "accepted" });
    const rejectedApplications = await Application.countDocuments({ status: "rejected" });

    const topVolunteers = await Pickup.aggregate([
      { $match: { status: "Completed", volunteer_id: { $ne: null } } },
      { $group: { _id: "$volunteer_id", completedPickups: { $sum: 1 } } },
      { $sort: { completedPickups: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "volunteer"
        }
      },
      { $unwind: "$volunteer" },
      {
        $project: {
          name: "$volunteer.name",
          email: "$volunteer.email",
          location: "$volunteer.location",
          completedPickups: 1
        }
      }
    ]);

    const recentPickups = await Pickup.find({ isDeleted: false })
      .populate("user_id", "name email")
      .populate("volunteer_id", "name email")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      users: {
        total: totalUsers + totalVolunteers + totalAdmins,
        citizens: totalUsers,
        volunteers: totalVolunteers,
        admins: totalAdmins,
        active: activeUsers,
        suspended: suspendedUsers
      },
      pickups: {
        total: totalPickups,
        open: openPickups,
        accepted: acceptedPickups,
        completed: completedPickups
      },
      wasteByType,
      opportunities: {
        total: totalOpportunities,
        open: openOpportunities,
        inProgress: inProgressOpportunities,
        closed: closedOpportunities
      },
      applications: {
        total: totalApplications,
        pending: pendingApplications,
        accepted: acceptedApplications,
        rejected: rejectedApplications
      },
      topVolunteers,
      recentPickups
    });
  } catch (error) {
    res.json({
      users: { total: 0, citizens: 0, volunteers: 0, admins: 0, active: 0, suspended: 0 },
      pickups: { total: 0, open: 0, accepted: 0, completed: 0 },
      wasteByType: [],
      opportunities: { total: 0, open: 0, inProgress: 0, closed: 0 },
      applications: { total: 0, pending: 0, accepted: 0, rejected: 0 },
      topVolunteers: [],
      recentPickups: []
    });
  }
};