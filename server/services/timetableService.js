const Exam = require("../models/Exam");

const getStudentTimetable = async (student) => {
  const exams = await Exam.find({
    academicYear: student.academicYear,
    sections: student.section,
    status: "scheduled",
  }).sort({
    examDate: 1,
    startTime: 1,
  });

  // Keep a convenient `section` field for existing frontend consumers
  // while exposing the complete multi-section data through `sections`.
  return exams.map((exam) => {
    const item = exam.toObject();
    item.section = student.section;
    return item;
  });
};

module.exports = {
  getStudentTimetable,
};
