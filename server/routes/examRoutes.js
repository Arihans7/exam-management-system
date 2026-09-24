const express = require("express");

const {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
} = require("../controllers/examController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin Exam CRUD
router.post("/", protect, adminOnly, createExam);
router.get("/", protect, adminOnly, getExams);
router.get("/:id", protect, adminOnly, getExamById);
router.put("/:id", protect, adminOnly, updateExam);
router.delete("/:id", protect, adminOnly, deleteExam);

module.exports = router;