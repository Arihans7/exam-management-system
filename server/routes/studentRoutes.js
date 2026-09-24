const express = require("express");

const {
  getMyProfile,
  getMyTimetable,
} = require("../controllers/studentController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", protect, getMyProfile);

router.get("/me/timetable", protect, getMyTimetable);

module.exports = router;