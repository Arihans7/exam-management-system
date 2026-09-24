import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function StudentDashboard() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const loadTimetable = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/students/me/timetable",
        getAuthConfig()
      );

      setStudent(response.data.student);
      setExams(response.data.exams || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load your timetable."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadTimetable();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getInitial = () => {
    return (student?.name || "S")
      .charAt(0)
      .toUpperCase();
  };

  const sortedExams = [...exams].sort(
    (a, b) =>
      new Date(a.examDate) -
      new Date(b.examDate)
  );

  const nextExam = sortedExams[0];

  return (
    <div className="student-shell">

      {/* Sidebar */}

      <aside className="student-sidebar">

        <div className="student-brand">

          <div className="student-brand-mark">
            E
          </div>

          <div>
            <strong>ExamFlow</strong>
            <span>Student Portal</span>
          </div>

        </div>

        <nav className="student-nav">

          <div className="student-nav-item active">
            <span>▦</span>
            Dashboard
          </div>

          <div className="student-nav-item">
            <span>◷</span>
            My Timetable
          </div>

        </nav>

        <div className="student-sidebar-bottom">

          <div className="student-profile">

            <div className="student-avatar">
              {getInitial()}
            </div>

            <div>
              <strong>
                {student?.name || "Student"}
              </strong>

              <span>Student</span>
            </div>

          </div>

          <button
            className="student-logout"
            onClick={logout}
          >
            Sign out
          </button>

        </div>

      </aside>

      {/* Main */}

      <div className="student-main">

        {/* Header */}

        <header className="student-topbar">

          <div>

            <span className="student-page-label">
              STUDENT PORTAL
            </span>

            <h1>
              Welcome back
              {student?.name
                ? `, ${student.name.split(" ")[0]}`
                : ""}
              .
            </h1>

            <p>
              Here is your examination schedule
              for the current academic session.
            </p>

          </div>

          {student && (
            <div className="student-top-profile">

              <div className="student-top-avatar">
                {getInitial()}
              </div>

              <div>
                <strong>{student.name}</strong>

                <span>
                  {student.academicYear} · Section{" "}
                  {student.section}
                </span>
              </div>

            </div>
          )}

        </header>

        <main className="student-content">

          {/* Error */}

          {error && (
            <div className="student-alert">
              <span>!</span>
              {error}
            </div>
          )}

          {/* Student Summary */}

          {student && (
            <section className="student-summary-grid">

              <div className="student-info-card">

                <div className="student-info-icon blue">
                  A
                </div>

                <div>
                  <span>Academic Year</span>
                  <strong>
                    {student.academicYear}
                  </strong>
                </div>

              </div>

              <div className="student-info-card">

                <div className="student-info-icon green">
                  #
                </div>

                <div>
                  <span>Section</span>
                  <strong>
                    Section {student.section}
                  </strong>
                </div>

              </div>

              <div className="student-info-card">

                <div className="student-info-icon purple">
                  ▦
                </div>

                <div>
                  <span>Scheduled Exams</span>
                  <strong>
                    {exams.length}
                  </strong>
                </div>

              </div>

            </section>
          )}

          {/* Next Examination */}

          {!loading && nextExam && (
            <section className="next-exam-card">

              <div className="next-exam-content">

                <span className="next-exam-label">
                  NEXT EXAMINATION
                </span>

                <h2>{nextExam.subject}</h2>

                <p>
                  {formatDate(nextExam.examDate)}
                </p>

                <div className="next-exam-details">

                  <div>
                    <span>Time</span>
                    <strong>
                      {nextExam.startTime}
                      {" – "}
                      {nextExam.endTime}
                    </strong>
                  </div>

                  <div>
                    <span>Section</span>
                    <strong>
                      {nextExam.section}
                    </strong>
                  </div>

                </div>

              </div>

              <div className="next-exam-date">

                <span>
                  {new Date(
                    nextExam.examDate
                  ).toLocaleDateString("en-IN", {
                    month: "short",
                  })}
                </span>

                <strong>
                  {new Date(
                    nextExam.examDate
                  ).getDate()}
                </strong>

                <small>
                  {new Date(
                    nextExam.examDate
                  ).getFullYear()}
                </small>

              </div>

            </section>
          )}

          {/* Timetable */}

          <section className="student-dashboard-card">

            <div className="student-card-heading">

              <div>

                <span className="student-section-label">
                  SCHEDULE
                </span>

                <h2>My examination timetable</h2>

                <p>
                  Your schedule is automatically
                  filtered for your academic year
                  and section.
                </p>

              </div>

              <div className="student-exam-count">
                {exams.length}{" "}
                {exams.length === 1
                  ? "exam"
                  : "exams"}
              </div>

            </div>

            {loading ? (

              <div className="student-empty">

                <div className="student-spinner" />

                <p>
                  Loading your timetable...
                </p>

              </div>

            ) : exams.length === 0 ? (

              <div className="student-empty">

                <div className="student-empty-icon">
                  ▦
                </div>

                <h3>
                  No examinations scheduled
                </h3>

                <p>
                  There are currently no exams
                  assigned to your section.
                </p>

              </div>

            ) : (

              <div className="student-exam-list">

                {sortedExams.map((exam, index) => (

                  <div
                    className="student-exam-row"
                    key={exam._id}
                  >

                    <div className="student-date-box">

                      <strong>
                        {new Date(
                          exam.examDate
                        ).getDate()}
                      </strong>

                      <span>
                        {new Date(
                          exam.examDate
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            month: "short",
                          }
                        )}
                      </span>

                    </div>

                    <div className="student-exam-subject">

                      <div className="student-subject-icon">
                        {exam.subject
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>

                        <h3>
                          {exam.subject}
                        </h3>

                        <p>
                          {formatDate(
                            exam.examDate
                          )}
                        </p>

                      </div>

                    </div>

                    <div className="student-exam-meta">

                      <span>TIME</span>

                      <strong>
                        {exam.startTime}
                        {" – "}
                        {exam.endTime}
                      </strong>

                    </div>

                    <div className="student-exam-meta">

                      <span>SECTION</span>

                      <strong>
                        Section {exam.section}
                      </strong>

                    </div>

                    <div className="student-row-number">
                      #{String(index + 1).padStart(2, "0")}
                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>

        </main>

      </div>

    </div>
  );
}

export default StudentDashboard;