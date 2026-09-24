const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (student) => {
  return jwt.sign(
    {
      id: student._id,
      role: student.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

// Register student/admin
const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      academicYear,
      section,
      role = "student",
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !academicYear ||
      !section
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const existingStudent = await Student.findOne({
      email: email.toLowerCase(),
    });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      academicYear,
      section,
      role,
    });

    const token = generateToken(student);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
        academicYear: student.academicYear,
        section: student.section,
        role: student.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const student = await Student.findOne({
      email: email.toLowerCase(),
    });

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      student.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(student);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
        academicYear: student.academicYear,
        section: student.section,
        role: student.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};