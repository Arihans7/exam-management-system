const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const examRoutes = require("./routes/examRoutes");
const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const allocationRoutes = require("./routes/allocationRoutes");
const { protect } = require("./middleware/authMiddleware");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Exam Management System API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server and API are healthy",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/allocations", allocationRoutes);

// Logged-in user
app.get("/api/auth/me", protect, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
