const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const adminController = require("../controllers/adminController");

// All routes require admin role
router.get("/users",           authMiddleware, roleMiddleware("admin"), adminController.getAllUsers);
router.put("/users/:id/suspend",  authMiddleware, roleMiddleware("admin"), adminController.suspendUser);
router.put("/users/:id/activate", authMiddleware, roleMiddleware("admin"), adminController.activateUser);
router.get("/logs",            authMiddleware, roleMiddleware("admin"), adminController.getAdminLogs);
router.get("/reports",         authMiddleware, roleMiddleware("admin"), adminController.getReports);

module.exports = router;