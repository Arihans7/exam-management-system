const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },

    academicYear: {
      type: String,
      required: [true, "Academic year is required"],
      trim: true,
    },

    // Advanced: one exam can belong to multiple sections
    sections: {
      type: [String],
      required: [true, "At least one section is required"],
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: "At least one section is required",
      },
    },

    examDate: {
      type: Date,
      required: [true, "Exam date is required"],
    },

    startTime: {
      type: String,
      required: [true, "Start time is required"],
      trim: true,
    },

    endTime: {
      type: String,
      required: [true, "End time is required"],
      trim: true,
    },

    // Advanced: rooms assigned to this exam
    rooms: [
      {
        roomId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Room",
        },
        capacity: Number,
        studentsAssigned: {
          type: Number,
          default: 0,
        },
      },
    ],

    status: {
      type: String,
      enum: ["scheduled", "cancelled"],
      default: "scheduled",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Exam", examSchema);