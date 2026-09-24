import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Student() {
  const navigate = useNavigate();

  const [user] = useState(() => {
    const storedUser = localStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchExams = async (currentUser) => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/exams");

      const data = response.data;

      const allExams =
        data?.exams ||
        data?.data ||
        data ||
        [];

      const filteredExams = Array.isArray(allExams)
        ? allExams.filter(
            (exam) =>
              String(exam.academicYear).trim().toLowerCase() ===
                String(currentUser.academicYear).trim().toLowerCase() &&
              String(exam.section).trim().toLowerCase() ===
                String(currentUser.section).trim().toLowerCase()
          )
        : [];

      setExams(filteredExams);
    } catch (err) {
      console.error("Failed to fetch exams:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load examination timetable."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const timeoutId = setTimeout(() => {
      fetchExams(user);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [navigate, user]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getExamDate = (exam) => {
    return new Date(
      exam.examDate || exam.date
    );
  };

  const getExamStatus = (exam) => {
    const today = new Date();
    const examDate = getExamDate(exam);

    today.setHours(0, 0, 0, 0);
    examDate.setHours(0, 0, 0, 0);

    if (examDate.getTime() < today.getTime()) {
      return "completed";
    }

    if (examDate.getTime() === today.getTime()) {
      return "today";
    }

    return "upcoming";
  };

  const formatDate = (exam) => {
    const date = getExamDate(exam);

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDay = (exam) => {
    const date = getExamDate(exam);

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
    });
  };

  const formatMonth = (exam) => {
    const date = getExamDate(exam);

    return date
      .toLocaleDateString("en-GB", {
        month: "short",
      })
      .toUpperCase();
  };

  const getStatusLabel = (status) => {
    if (status === "today") return "TODAY";
    if (status === "completed") return "COMPLETED";
    return "UPCOMING";
  };

  const upcomingCount = exams.filter((exam) => {
    const status = getExamStatus(exam);
    return status === "upcoming" || status === "today";
  }).length;

  if (loading) {
    return (
      <div className="student-loading">
        <div className="student-spinner" />
        <p>Loading your timetable...</p>
      </div>
    );
  }

  return (
    <div className="student-page">

      {/* Header */}

      <header className="student-header">

        <div>
          <div className="student-eyebrow">
            STUDENT PORTAL
          </div>

          <h1>My Examination Timetable</h1>

          <p>
            Your examinations are filtered according to
            your academic year and section.
          </p>
        </div>

        <div className="student-user-area">

          <div className="student-user-info">
            <strong>
              {user?.name || "Student"}
            </strong>

            <span>
              {user?.academicYear || "Student"} ·
              {" "}
              Section {user?.section || "-"}
            </span>
          </div>

          <button
            className="student-logout"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </header>

      {/* Main */}

      <main className="student-main">

        {/* Statistics */}

        <section className="student-stats">

          <div className="student-stat">
            <span>ACADEMIC YEAR</span>
            <strong>
              {user?.academicYear || "-"}
            </strong>
          </div>

          <div className="student-stat">
            <span>SECTION</span>
            <strong>
              {user?.section || "-"}
            </strong>
          </div>

          <div className="student-stat">
            <span>UPCOMING EXAMS</span>
            <strong>{upcomingCount}</strong>
          </div>

        </section>

        {/* Timetable */}

        <section className="student-timetable">

          <div className="student-section-heading">

            <div>
              <h2>Your Timetable</h2>

              <p>
                Only examinations assigned to your
                academic year and section are shown.
              </p>
            </div>

            <span className="exam-count">
              {exams.length}{" "}
              {exams.length === 1 ? "Exam" : "Exams"}
            </span>

          </div>

          {error ? (
            <div className="student-error">
              <div>!</div>
              <span>{error}</span>
            </div>
          ) : exams.length === 0 ? (
            <div className="student-empty">

              <div className="empty-calendar">
                📅
              </div>

              <h3>
                No examinations scheduled
              </h3>

              <p>
                Your examination timetable will
                appear here once an exam is created.
              </p>

            </div>
          ) : (
            <div className="student-exam-list">

              {exams
                .sort(
                  (a, b) =>
                    getExamDate(a) - getExamDate(b)
                )
                .map((exam) => {

                  const status = getExamStatus(exam);

                  return (
                    <article
                      className={`student-exam-card ${status}`}
                      key={exam._id || exam.id}
                    >

                      {/* Date */}

                      <div className="exam-date-box">

                        <strong>
                          {formatDay(exam)}
                        </strong>

                        <span>
                          {formatMonth(exam)}
                        </span>

                      </div>

                      {/* Information */}

                      <div className="exam-information">

                        <div className="exam-status-row">

                          <span
                            className={`exam-status ${status}`}
                          >
                            <i />
                            {getStatusLabel(status)}
                          </span>

                        </div>

                        <h3>
                          {exam.subject}
                        </h3>

                        <p>
                          {formatDate(exam)}
                        </p>

                      </div>

                      {/* Time */}

                      <div className="exam-time">

                        <span>EXAM TIME</span>

                        <strong>
                          {exam.startTime}{" "}
                          –{" "}
                          {exam.endTime}
                        </strong>

                      </div>

                      {/* Section */}

                      <div className="exam-section">

                        <span>SECTION</span>

                        <strong>
                          {exam.section}
                        </strong>

                      </div>

                    </article>
                  );
                })}

            </div>
          )}

        </section>

      </main>

    </div>
  );
}

export default Student;