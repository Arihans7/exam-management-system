const Room = require("../models/Room");

// Create room
const createRoom = async (req, res, next) => {
  try {
    const { roomNumber, capacity, location, active } = req.body;

    if (!roomNumber || !capacity || !location) {
      return res.status(400).json({
        success: false,
        message: "Room number, capacity and location are required",
      });
    }

    if (Number(capacity) < 1) {
      return res.status(400).json({
        success: false,
        message: "Capacity must be at least 1",
      });
    }

    const room = await Room.create({
      roomNumber,
      capacity: Number(capacity),
      location,
      active: active !== false,
    });

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    next(error);
  }
};

// Get rooms
const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find().sort({ roomNumber: 1 });

    res.json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    next(error);
  }
};

// Update room
const updateRoom = async (req, res, next) => {
  try {
    const { roomNumber, capacity, location, active } = req.body;

    if (!roomNumber || !capacity || !location) {
      return res.status(400).json({
        success: false,
        message: "Room number, capacity and location are required",
      });
    }

    if (Number(capacity) < 1) {
      return res.status(400).json({
        success: false,
        message: "Capacity must be at least 1",
      });
    }

    const room = await Room.findByIdAndUpdate(
      req.params.id,
      {
        roomNumber,
        capacity: Number(capacity),
        location,
        active: active !== false,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.json({
      success: true,
      message: "Room updated successfully",
      room,
    });
  } catch (error) {
    next(error);
  }
};

// Delete room
const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRoom,
  getRooms,
  updateRoom,
  deleteRoom,
};