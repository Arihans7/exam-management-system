const Exam = require("../models/Exam");
const Room = require("../models/Room");
const Student = require("../models/Student");
const SeatAssignment = require("../models/SeatAssignment");

const overlaps = (aStart, aEnd, bStart, bEnd) =>
  aStart < bEnd && bStart < aEnd;

const allocateSeats = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ success: false, message: "Exam not found" });

    const roomIds = Array.isArray(req.body.roomIds) ? req.body.roomIds : [];
    if (!roomIds.length) {
      return res.status(400).json({ success: false, message: "Select at least one room" });
    }

    const rooms = await Room.find({ _id: { $in: roomIds }, active: true });
    if (rooms.length !== roomIds.length) {
      return res.status(400).json({ success: false, message: "One or more rooms are invalid or inactive" });
    }

    // Prevent room clashes with other exams.
    const otherExams = await Exam.find({ _id: { $ne: exam._id }, status: "scheduled" });
    const clash = otherExams.find((other) =>
      other.rooms?.some((assignedRoom) =>
        roomIds.some((id) => String(id) === String(assignedRoom.roomId)) &&
        String(other.examDate).slice(0, 10) === String(exam.examDate).slice(0, 10) &&
        overlaps(exam.startTime, exam.endTime, other.startTime, other.endTime)
      )
    );

    if (clash) {
      return res.status(409).json({
        success: false,
        message: `Room clash detected with ${clash.subject}`,
      });
    }

    const students = await Student.find({
      academicYear: exam.academicYear,
      section: { $in: exam.sections },
      role: "student",
    }).sort({ section: 1, name: 1 });

    if (!students.length) {
      return res.status(400).json({ success: false, message: "No students found for the selected sections" });
    }

    const capacity = rooms.reduce((sum, room) => sum + room.capacity, 0);
    if (students.length > capacity) {
      return res.status(409).json({
        success: false,
        message: `Insufficient capacity: ${students.length} students, ${capacity} seats available`,
      });
    }

    // Prevent a student from being scheduled in overlapping exams.
    const existing = await SeatAssignment.find({ student: { $in: students.map((s) => s._id) } }).populate("exam");
    const conflictingStudentIds = new Set(
      existing
        .filter((a) => a.exam && String(a.exam.examDate).slice(0, 10) === String(exam.examDate).slice(0, 10) && overlaps(exam.startTime, exam.endTime, a.exam.startTime, a.exam.endTime) && String(a.exam._id) !== String(exam._id))
        .map((a) => String(a.student))
    );

    if (conflictingStudentIds.size) {
      return res.status(409).json({
        success: false,
        message: `${conflictingStudentIds.size} student(s) have an overlapping exam`,
      });
    }

    await SeatAssignment.deleteMany({ exam: exam._id });

    // Interleave sections: A1, B1, A2, B2... instead of placing one section together.
    const bySection = {};
    exam.sections.forEach((section) => { bySection[section] = []; });
    students.forEach((student) => bySection[student.section]?.push(student));

    const orderedStudents = [];
    let added = true;
    while (added) {
      added = false;
      for (const section of exam.sections) {
        const next = bySection[section]?.shift();
        if (next) {
          orderedStudents.push(next);
          added = true;
        }
      }
    }

    const assignments = [];
    let studentIndex = 0;
    for (const room of rooms) {
      for (let seat = 1; seat <= room.capacity && studentIndex < orderedStudents.length; seat++) {
        const student = orderedStudents[studentIndex++];
        assignments.push({
          exam: exam._id,
          student: student._id,
          room: room._id,
          seatNumber: seat,
          section: student.section,
        });
      }
    }

    await SeatAssignment.insertMany(assignments);

    exam.rooms = rooms.map((room) => ({
      roomId: room._id,
      capacity: room.capacity,
      studentsAssigned: assignments.filter((a) => String(a.room) === String(room._id)).length,
    }));
    await exam.save();

    res.json({
      success: true,
      message: "Rooms allocated and seats assigned successfully",
      totalStudents: assignments.length,
      rooms: exam.rooms,
    });
  } catch (error) {
    next(error);
  }
};

const getExamAllocations = async (req, res, next) => {
  try {
    const assignments = await SeatAssignment.find({ exam: req.params.id })
      .populate("student", "name email academicYear section")
      .populate("room", "roomNumber location capacity")
      .sort({ room: 1, seatNumber: 1 });

    res.json({ success: true, count: assignments.length, assignments });
  } catch (error) {
    next(error);
  }
};

module.exports = { allocateSeats, getExamAllocations };
