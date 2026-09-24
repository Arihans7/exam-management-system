const express = require("express");

const {
  createRoom,
  getRooms,
  updateRoom,
  deleteRoom,
} = require("../controllers/roomController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, adminOnly, createRoom);
router.get("/", protect, adminOnly, getRooms);
router.put("/:id", protect, adminOnly, updateRoom);
router.delete("/:id", protect, adminOnly, deleteRoom);

module.exports = router;