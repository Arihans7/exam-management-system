const express = require("express");
const {
  allocateSeats,
  getExamAllocations,
} = require("../controllers/allocationController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Generate room allocation + interleaved seating for an exam
router.post("/exams/:id/allocate", protect, adminOnly, allocateSeats);

// View generated seating plan
router.get("/exams/:id", protect, adminOnly, getExamAllocations);

module.exports = router;
