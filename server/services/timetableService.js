const Exam = require("../models/Exam");

const getStudentTimetable = async (student) => {
  const exams = await Exam.find({
    academicYear: student.academicYear,
    section: student.section,
  }).sort({
    examDate: 1,
    startTime: 1,
  });

  return exams;
};

module.exports = {
  getStudentTimetable,
};