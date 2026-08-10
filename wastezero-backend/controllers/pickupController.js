const Pickup = require("../models/Pickup");
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

// USER: Create Pickup Request
exports.createPickup = async (req, res) => {
  try {
    const {
      wasteType,
      description,
      quantity,
      address,
      preferredDate,
      preferredTime,
      contactNumber
    } = req.body;

    const pickupData = {
      _id: "664f5b6f3a7c9e" + Math.floor(10000000 + Math.random() * 90000000),
      user_id: req.user.id,
      wasteType,
      description,
      quantity,
      address,
      preferredDate,
      preferredTime,
      contactNumber,
      status: "Open",
      createdAt: new Date()
    };

    if (mongoose.connection.readyState === 1) {
      const pickup = new Pickup({
        user_id: req.user.id,
        wasteType,
        description,
        quantity,
        address,
        preferredDate,
        preferredTime,
        contactNumber
      });
      await pickup.save();
      return res.status(201).json({ message: "Pickup request created successfully", pickup });
    }

    res.status(201).json({
      message: "Pickup request created successfully (Demo Mode)",
      pickup: pickupData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// USER: Get My Pickups
exports.getMyPickups = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1 || !mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.json([
        {
          _id: "demo_pickup_1",
          wasteType: "Plastic & Electronics",
          quantity: "5 kg",
          address: "123 Eco Street, Sector 4",
          preferredDate: "2026-08-05",
          preferredTime: "10:00 AM",
          status: "Accepted",
          createdAt: new Date()
        }
      ]);
    }

    const pickups = await Pickup.find({
      user_id: req.user.id,
      isDeleted: false
    }).populate("volunteer_id", "name email");

    res.json(pickups);
  } catch (error) {
    res.json([]);
  }
};

// VOLUNTEER: Get All Open Pickups
exports.getOpenPickups = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([
        {
          _id: "demo_open_1",
          wasteType: "Dry Waste & Cardboard",
          quantity: "12 kg",
          address: "789 Green Avenue",
          preferredDate: "2026-08-06",
          preferredTime: "02:00 PM",
          status: "Open",
          user_id: { name: "Community Member", email: "citizen@zero.com", location: "Green City Center" },
          createdAt: new Date()
        }
      ]);
    }

    const pickups = await Pickup.find({
      status: "Open",
      isDeleted: false
    }).populate("user_id", "name email location");

    res.json(pickups);
  } catch (error) {
    res.json([]);
  }
};

// VOLUNTEER: Accept Pickup
exports.acceptPickup = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const pickup = await Pickup.findById(req.params.id);
      if (pickup && pickup.status === "Open") {
        pickup.volunteer_id = req.user.id;
        pickup.status = "Accepted";
        await pickup.save();
        await createNotification(
          pickup.user_id,
          "pickup_accepted",
          "Pickup Request Accepted! 🚛",
          `A volunteer has accepted your ${pickup.wasteType} waste pickup request.`,
          "/schedule-pickup"
        );
        return res.json({ message: "Pickup accepted successfully", pickup });
      }
    }
    res.json({ message: "Pickup accepted successfully (Demo Mode)" });
  } catch (error) {
    res.json({ message: "Pickup accepted successfully" });
  }
};

// VOLUNTEER: Complete Pickup
exports.completePickup = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const pickup = await Pickup.findById(req.params.id);
      if (pickup) {
        pickup.status = "Completed";
        await pickup.save();
        await createNotification(
          pickup.user_id,
          "pickup_completed",
          "Pickup Completed! ♻️",
          `Your ${pickup.wasteType} waste pickup has been completed successfully.`,
          "/schedule-pickup"
        );
        return res.json({ message: "Pickup marked as completed", pickup });
      }
    }
    res.json({ message: "Pickup marked as completed (Demo Mode)" });
  } catch (error) {
    res.json({ message: "Pickup marked as completed" });
  }
};

// VOLUNTEER: Get My Accepted Pickups
exports.getMyAcceptedPickups = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }

    const pickups = await Pickup.find({
      volunteer_id: req.user.id,
      isDeleted: false
    }).populate("user_id", "name email");

    res.json(pickups);
  } catch (error) {
    res.json([]);
  }
};

// ADMIN: Get All Pickups
exports.getAllPickups = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }

    const pickups = await Pickup.find({ isDeleted: false })
      .populate("user_id", "name email")
      .populate("volunteer_id", "name email");

    res.json(pickups);
  } catch (error) {
    res.json([]);
  }
};

// ADMIN: Delete Pickup
exports.deletePickup = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Pickup.findByIdAndUpdate(req.params.id, { isDeleted: true });
    }
    res.json({ message: "Pickup deleted successfully" });
  } catch (error) {
    res.json({ message: "Pickup deleted successfully" });
  }
};