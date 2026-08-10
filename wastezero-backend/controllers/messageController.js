const Message = require("../models/Message");
const User = require("../models/User");
const mongoose = require("mongoose");

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { receiver_id, content } = req.body;
    const sender_id = req.user.id;

    if (!receiver_id || !content) {
      return res.status(400).json({ message: "Receiver and content required" });
    }

    const messageData = {
      _id: "demo_msg_" + Date.now(),
      sender_id: { _id: sender_id, name: "You" },
      receiver_id: { _id: receiver_id, name: "Recipient" },
      content,
      createdAt: new Date()
    };

    if (mongoose.connection.readyState === 1) {
      const message = new Message({ sender_id, receiver_id, content });
      await message.save();
    }

    res.status(201).json({ message: "Message sent", data: messageData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get conversation between two users
exports.getConversation = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }

    const myId = req.user.id;
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender_id: myId, receiver_id: userId },
        { sender_id: userId, receiver_id: myId }
      ]
    })
      .populate("sender_id", "name role")
      .populate("receiver_id", "name role")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.json([]);
  }
};

// Get all conversations (inbox)
exports.getInbox = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }

    const myId = req.user.id;

    const messages = await Message.find({
      $or: [{ sender_id: myId }, { receiver_id: myId }]
    })
      .populate("sender_id", "name role")
      .populate("receiver_id", "name role")
      .sort({ createdAt: -1 });

    const seen = new Set();
    const conversations = [];

    for (const msg of messages) {
      const other =
        msg.sender_id._id.toString() === myId
          ? msg.receiver_id
          : msg.sender_id;

      if (!seen.has(other._id.toString())) {
        seen.add(other._id.toString());
        conversations.push({
          user: other,
          lastMessage: msg.content,
          lastTime: msg.createdAt,
          unread: 0
        });
      }
    }

    res.json(conversations);
  } catch (error) {
    res.json([]);
  }
};

// Get all users to start conversation
exports.getUsers = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([
        { _id: "664f5b6f3a7c9e0011111111", name: "Demo Citizen", email: "user@zero.com", role: "user", location: "Green City Center" },
        { _id: "664f5b6f3a7c9e0022222222", name: "Demo Volunteer", email: "volunteer@zero.com", role: "volunteer", location: "Green City Center" },
        { _id: "664f5b6f3a7c9e0033333333", name: "System Admin", email: "admin@zero.com", role: "admin", location: "Headquarters" }
      ]);
    }

    const users = await User.find(
      { _id: { $ne: req.user.id } },
      "name email role location"
    );
    res.json(users);
  } catch (error) {
    res.json([]);
  }
};

// Get unread message count
exports.getUnreadCount = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ count: 0 });
    }

    const count = await Message.countDocuments({
      receiver_id: req.user.id,
      isRead: false
    });
    res.json({ count });
  } catch (error) {
    res.json({ count: 0 });
  }
};