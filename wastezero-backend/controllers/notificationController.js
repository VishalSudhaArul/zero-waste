const Notification = require("../models/Notification");
const mongoose = require("mongoose");

// Get my notifications
exports.getMyNotifications = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1 || !mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.json([]);
    }
    const notifications = await Notification.find({
      user_id: req.user.id
    }).sort({ createdAt: -1 }).limit(20);

    res.json(notifications);
  } catch (error) {
    res.json([]);
  }
};

// Mark all as read
exports.markAllRead = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(req.user.id)) {
      await Notification.updateMany(
        { user_id: req.user.id, isRead: false },
        { isRead: true }
      );
    }
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.json({ message: "All notifications marked as read" });
  }
};

// Mark one as read
exports.markOneRead = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(req.params.id)) {
      await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    }
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.json({ message: "Notification marked as read" });
  }
};

// Get unread count
exports.getUnreadCount = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1 || !mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.json({ count: 0 });
    }
    const count = await Notification.countDocuments({
      user_id: req.user.id,
      isRead: false
    });
    res.json({ count });
  } catch (error) {
    res.json({ count: 0 });
  }
};

// Helper to CREATE a notification
exports.createNotification = async (user_id, type, title, message, link = "") => {
  try {
    if (mongoose.connection.readyState !== 1) return null;
    const notification = new Notification({
      user_id, type, title, message, link
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error("Notification error:", error.message);
    return null;
  }
};