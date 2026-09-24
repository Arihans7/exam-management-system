const Exam = require("../models/Exam");

// Create exam
const createExam = async (req, res, next) => {
  try {
    const {
      subject,
      academicYear,
      section,
      examDate,
      startTime,
      endTime,
    } = req.body;

    if (
      !subject ||
      !academicYear ||
      !section ||
      !examDate ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({
        success: false,
        message: "All exam fields are required",
      });
    }

    if (endTime <= startTime) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time",
      });
    }

    const exam = await Exam.create({
      subject,
      academicYear,
      section,
      examDate,
      startTime,
      endTime,
    });

    res.status(201).json({
      success: true,
      message: "Exam created successfully",
      exam,
    });
  } catch (error) {
    next(error);
  }
};

// Get all exams
const getExams = async (req, res, next) => {
  try {
    const exams = await Exam.find().sort({
      examDate: 1,
      startTime: 1,
    });

    res.json({
      success: true,
      count: exams.length,
      exams,
    });
  } catch (error) {
    next(error);
  }
};

// Get single exam
const getExamById = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    res.json({
      success: true,
      exam,
    });
  } catch (error) {
    next(error);
  }
};

// Update exam
const updateExam = async (req, res, next) => {
  try {
    const {
      subject,
      academicYear,
      section,
      examDate,
      startTime,
      endTime,
    } = req.body;

    if (
      !subject ||
      !academicYear ||
      !section ||
      !examDate ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({
        success: false,
        message: "All exam fields are required",
      });
    }

    if (endTime <= startTime) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time",
      });
    }

    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      {
        subject,
        academicYear,
        section,
        examDate,
        startTime,
        endTime,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    res.json({
      success: true,
      message: "Exam updated successfully",
      exam,
    });
  } catch (error) {
    next(error);
  }
};

// Delete/cancel exam
const deleteExam = async (req, res, next) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    res.json({
      success: true,
      message: "Exam cancelled successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
};