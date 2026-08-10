const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const opportunityController = require("../controllers/opportunityController");

// ─── IMPORTANT: Specific routes MUST come before /:id routes ───

// Admin: Create opportunity
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  opportunityController.createOpportunity
);

// Volunteer: Get matched opportunities  ← must be before GET /
router.get(
  "/matched",
  authMiddleware,
  roleMiddleware("volunteer"),
  opportunityController.getMatchedOpportunities
);

// Admin: Get ALL opportunities (including closed)  ← must be before GET /
router.get(
  "/all",
  authMiddleware,
  roleMiddleware("admin"),
  opportunityController.getAllOpportunities
);

// Volunteer + Admin: Get open opportunities
router.get(
  "/",
  authMiddleware,
  opportunityController.getOpportunities
);

// Admin: Update opportunity
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  opportunityController.updateOpportunity
);

// Admin: Delete opportunity (soft delete)
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  opportunityController.deleteOpportunity
);

// ─── module.exports MUST always be at the bottom ───
module.exports = router;