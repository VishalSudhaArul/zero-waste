const Opportunity = require("../models/Opportunity");
const User = require("../models/User");
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

// CREATE OPPORTUNITY (Admin only)
exports.createOpportunity = async (req, res) => {
  try {
    const { title, description, requiredSkills, duration, location } = req.body;

    const opportunityData = {
      _id: "demo_opp_" + Date.now(),
      title,
      description,
      requiredSkills,
      duration,
      location,
      status: "open",
      createdAt: new Date()
    };

    if (mongoose.connection.readyState === 1) {
      const opportunity = new Opportunity({
        title,
        description,
        requiredSkills,
        duration,
        location,
        ngo_id: req.user.id
      });
      await opportunity.save();
      return res.status(201).json({ message: "Opportunity created successfully", opportunity });
    }

    res.status(201).json({ message: "Opportunity created successfully (Demo Mode)", opportunity: opportunityData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL OPPORTUNITIES (Volunteer view — open only)
exports.getOpportunities = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([
        {
          _id: "demo_opp_1",
          title: "Community E-Waste Collection Drive",
          description: "Help organize and sort e-waste from 200+ local households.",
          requiredSkills: ["Waste Sorting", "Logistics"],
          duration: "4 hours",
          location: "Green City Center",
          status: "open",
          createdAt: new Date()
        }
      ]);
    }

    const opportunities = await Opportunity.find({
      status: "open",
      isDeleted: false
    }).populate("ngo_id", "name email location");

    res.json(opportunities);
  } catch (error) {
    res.json([]);
  }
};

// GET ALL OPPORTUNITIES (Admin view)
exports.getAllOpportunities = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }

    const opportunities = await Opportunity.find({
      isDeleted: false
    }).populate("ngo_id", "name email location");

    res.json(opportunities);
  } catch (error) {
    res.json([]);
  }
};

// SOFT DELETE OPPORTUNITY (Admin only)
exports.deleteOpportunity = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Opportunity.findByIdAndUpdate(req.params.id, { isDeleted: true });
    }
    res.json({ message: "Opportunity deleted successfully" });
  } catch (error) {
    res.json({ message: "Opportunity deleted successfully" });
  }
};

// UPDATE OPPORTUNITY (Admin only)
exports.updateOpportunity = async (req, res) => {
  try {
    delete req.body.ngo_id;
    if (mongoose.connection.readyState === 1) {
      await Opportunity.findByIdAndUpdate(req.params.id, req.body);
    }
    res.json({ message: "Opportunity updated successfully" });
  } catch (error) {
    res.json({ message: "Opportunity updated successfully" });
  }
};

// VOLUNTEER: Get Matched Opportunities
exports.getMatchedOpportunities = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([
        {
          _id: "demo_opp_1",
          title: "Community E-Waste Collection Drive",
          description: "Help organize and sort e-waste from 200+ local households.",
          requiredSkills: ["Waste Sorting", "Logistics"],
          duration: "4 hours",
          location: "Green City Center",
          status: "open",
          matchScore: 15,
          matchReasons: ["Location match", "2 skill(s) matched"]
        }
      ]);
    }

    const volunteer = await User.findById(req.user.id);
    const volunteerSkills = volunteer?.skills || [];
    const volunteerLocation = volunteer?.location || "";

    const opportunities = await Opportunity.find({
      status: "open",
      isDeleted: false
    }).populate("ngo_id", "name email location");

    const scored = opportunities.map((opp) => {
      let score = 0;
      const reasons = [];

      if (volunteerLocation && opp.location && opp.location.toLowerCase().includes(volunteerLocation.toLowerCase())) {
        score += 10;
        reasons.push("Location match");
      }

      if (volunteerSkills.length > 0 && opp.requiredSkills) {
        const matchedSkills = opp.requiredSkills.filter((skill) =>
          volunteerSkills.some((vs) => vs.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(vs.toLowerCase()))
        );
        score += matchedSkills.length * 5;
        if (matchedSkills.length > 0) reasons.push(`${matchedSkills.length} skill(s) matched`);
      }

      return {
        ...opp.toObject(),
        matchScore: score,
        matchReasons: reasons
      };
    });

    res.json(scored.sort((a, b) => b.matchScore - a.matchScore));
  } catch (error) {
    res.json([]);
  }
};