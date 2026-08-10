const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const pickupController = require("../controllers/pickupController");

// USER routes
router.post(
  "/",
  authMiddleware,
  roleMiddleware("user"),
  pickupController.createPickup
);

router.get(
  "/my",
  authMiddleware,
  roleMiddleware("user"),
  pickupController.getMyPickups
);

// VOLUNTEER routes
router.get(
  "/open",
  authMiddleware,
  roleMiddleware("volunteer"),
  pickupController.getOpenPickups
);

router.put(
  "/:id/accept",
  authMiddleware,
  roleMiddleware("volunteer"),
  pickupController.acceptPickup
);

router.put(
  "/:id/complete",
  authMiddleware,
  roleMiddleware("volunteer"),
  pickupController.completePickup
);

router.get(
  "/accepted",
  authMiddleware,
  roleMiddleware("volunteer"),
  pickupController.getMyAcceptedPickups
);

// ADMIN routes
router.get(
  "/all",
  authMiddleware,
  roleMiddleware("admin"),
  pickupController.getAllPickups
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  pickupController.deletePickup
);

module.exports = router;