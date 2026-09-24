const mongoose = require("mongoose");

const seatAssignmentSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    seatNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    section: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

seatAssignmentSchema.index({ exam: 1, student: 1 }, { unique: true });
seatAssignmentSchema.index({ exam: 1, room: 1, seatNumber: 1 }, { unique: true });

module.exports = mongoose.model("SeatAssignment", seatAssignmentSchema);
