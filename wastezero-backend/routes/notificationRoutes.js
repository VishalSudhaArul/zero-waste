const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const notificationController = require("../controllers/notificationController");

router.get("/", authMiddleware, notificationController.getMyNotifications);
router.get("/unread", authMiddleware, notificationController.getUnreadCount);
router.put("/read-all", authMiddleware, notificationController.markAllRead);
router.put("/:id/read", authMiddleware, notificationController.markOneRead);

module.exports = router;