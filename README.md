# Exam Management System

A role-based examination timetable management system developed for the internship assessment.

## Features

### Admin

- Secure admin login
- Create examinations
- View examination timetable
- Edit examinations
- Cancel examinations
- Validate required fields
- Validate examination time
- Manage exams by academic year and section

### Student

- Secure student login
- View personal examination timetable
- Timetable automatically filtered by:
  - Academic year
  - Section
- Students cannot access examinations belonging to another section or academic year

## Technology Stack

### Frontend

- React
- Vite
- React Router
- Axios
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

## Project Structure

```text
exam-management-system/
├── client/
└── server/