const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const messageController = require("../controllers/messageController");

router.post("/send", authMiddleware, messageController.sendMessage);
router.get("/inbox", authMiddleware, messageController.getInbox);
router.get("/users", authMiddleware, messageController.getUsers);
router.get("/unread", authMiddleware, messageController.getUnreadCount);
router.get("/:userId", authMiddleware, messageController.getConversation);

module.exports = router;