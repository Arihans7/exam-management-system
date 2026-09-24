const Student = require("../models/Student");
const { getStudentTimetable } = require("../services/timetableService");

// Get logged-in student profile
const getMyProfile = async (req, res, next) => {
  try {
    const student = await Student.findById(req.user._id).select(
      "-password"
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    res.json({
      success: true,
      student,
    });
  } catch (error) {
    next(error);
  }
};

// Get logged-in student's timetable
const getMyTimetable = async (req, res, next) => {
  try {
    const exams = await getStudentTimetable(req.user);

    res.json({
      success: true,
      student: {
        name: req.user.name,
        academicYear: req.user.academicYear,
        section: req.user.section,
      },
      count: exams.length,
      exams,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyProfile,
  getMyTimetable,
};