import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const emptyForm = {
  subject: "",
  academicYear: "",
  section: "",
  examDate: "",
  startTime: "",
  endTime: "",
};

function AdminDashboard() {
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const loadExams = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/exams",
        getAuthConfig()
      );

      setExams(response.data.exams || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load examinations."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadExams();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      if (editingId) {
        await api.put(
          `/exams/${editingId}`,
          form,
          getAuthConfig()
        );

        setSuccess("Examination updated successfully.");
      } else {
        await api.post(
          "/exams",
          form,
          getAuthConfig()
        );

        setSuccess("Examination scheduled successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);

      await loadExams();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to save examination."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (exam) => {
    setEditingId(exam._id);

    setForm({
      subject: exam.subject,
      academicYear: exam.academicYear,
      section: exam.section,
      examDate: exam.examDate.split("T")[0],
      startTime: exam.startTime,
      endTime: exam.endTime,
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this examination?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await api.delete(
        `/exams/${id}`,
        getAuthConfig()
      );

      setSuccess("Examination cancelled successfully.");

      await loadExams();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to cancel examination."
      );
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const upcomingExams = exams.filter(
    (exam) => new Date(exam.examDate) >= new Date()
  );

  const academicYears = new Set(
    exams.map((exam) => exam.academicYear)
  );

  const sections = new Set(
    exams.map((exam) => exam.section)
  );

  return (
    <div className="admin-shell">

      {/* Sidebar */}

      <aside className="admin-sidebar">

        <div className="brand">

          <div className="brand-mark">
            E
          </div>

          <div>
            <strong>ExamFlow</strong>
            <span>Management Portal</span>
          </div>

        </div>

        <nav className="sidebar-nav">

          <div className="nav-item active">
            <span className="nav-icon">▦</span>
            Dashboard
          </div>

          <div className="nav-item">
            <span className="nav-icon">◷</span>
            Examinations
          </div>

        </nav>

        <div className="sidebar-bottom">

          <div className="admin-profile">

            <div className="avatar">
              {(user.name || "A")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>
                {user.name || "Administrator"}
              </strong>

              <span>Administrator</span>
            </div>

          </div>

          <button
            className="sidebar-logout"
            onClick={logout}
          >
            Sign out
          </button>

        </div>

      </aside>

      {/* Main */}

      <div className="admin-main">

        {/* Top bar */}

        <header className="admin-topbar">

          <div>
            <span className="page-label">
              ADMINISTRATION
            </span>

            <h1>Exam Dashboard</h1>

            <p>
              Manage examination schedules and
              academic sections.
            </p>
          </div>

          <div className="topbar-date">
            <span>Today</span>

            <strong>
              {new Date().toLocaleDateString(
                "en-IN",
                {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              )}
            </strong>
          </div>

        </header>

        <main className="admin-content">

          {/* Alerts */}

          {error && (
            <div className="modern-alert alert-error">
              <span>!</span>
              {error}
            </div>
          )}

          {success && (
            <div className="modern-alert alert-success">
              <span>✓</span>
              {success}
            </div>
          )}

          {/* Statistics */}

          <section className="stats-grid">

            <div className="stat-card">

              <div className="stat-icon blue">
                ▦
              </div>

              <div>
                <span>Total Exams</span>
                <strong>{exams.length}</strong>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon green">
                ◷
              </div>

              <div>
                <span>Upcoming</span>
                <strong>
                  {upcomingExams.length}
                </strong>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon purple">
                A
              </div>

              <div>
                <span>Academic Years</span>
                <strong>
                  {academicYears.size}
                </strong>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon orange">
                #
              </div>

              <div>
                <span>Sections</span>
                <strong>
                  {sections.size}
                </strong>
              </div>

            </div>

          </section>

          {/* Create/Edit */}

          <section className="dashboard-card">

            <div className="card-heading">

              <div>

                <span className="section-label">
                  {editingId
                    ? "EDIT EXAMINATION"
                    : "NEW EXAMINATION"}
                </span>

                <h2>
                  {editingId
                    ? "Update examination"
                    : "Schedule an examination"}
                </h2>

                <p>
                  Provide the examination details
                  and academic assignment.
                </p>

              </div>

              {editingId && (
                <button
                  className="text-button"
                  onClick={handleCancelEdit}
                >
                  Cancel editing
                </button>
              )}

            </div>

            <form onSubmit={handleSubmit}>

              <div className="modern-form-grid">

                <div className="modern-form-group wide">

                  <label>Subject</label>

                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="e.g. Database Management Systems"
                    required
                  />

                </div>

                <div className="modern-form-group">

                  <label>Academic Year</label>

                  <input
                    name="academicYear"
                    value={form.academicYear}
                    onChange={handleChange}
                    placeholder="e.g. 2nd Year"
                    required
                  />

                </div>

                <div className="modern-form-group">

                  <label>Section</label>

                  <input
                    name="section"
                    value={form.section}
                    onChange={handleChange}
                    placeholder="e.g. A"
                    required
                  />

                </div>

                <div className="modern-form-group">

                  <label>Exam Date</label>

                  <input
                    type="date"
                    name="examDate"
                    value={form.examDate}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="modern-form-group">

                  <label>Start Time</label>

                  <input
                    type="time"
                    name="startTime"
                    value={form.startTime}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="modern-form-group">

                  <label>End Time</label>

                  <input
                    type="time"
                    name="endTime"
                    value={form.endTime}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

              <div className="form-footer">

                <span>
                  All fields are required.
                </span>

                <button
                  className="primary-action"
                  type="submit"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Save Changes"
                    : "Schedule Exam"}
                </button>

              </div>

            </form>

          </section>

          {/* Timetable */}

          <section className="dashboard-card">

            <div className="card-heading timetable-heading">

              <div>

                <span className="section-label">
                  SCHEDULE
                </span>

                <h2>Examination timetable</h2>

                <p>
                  All scheduled examinations
                  across academic sections.
                </p>

              </div>

              <div className="exam-count">
                {exams.length}{" "}
                {exams.length === 1
                  ? "exam"
                  : "exams"}
              </div>

            </div>

            {loading ? (

              <div className="modern-empty">
                <div className="loading-spinner" />
                <p>Loading examinations...</p>
              </div>

            ) : exams.length === 0 ? (

              <div className="modern-empty">
                <div className="empty-icon">
                  ▦
                </div>

                <h3>No examinations scheduled</h3>

                <p>
                  Create your first examination
                  using the form above.
                </p>
              </div>

            ) : (

              <div className="modern-table-wrapper">

                <table className="modern-table">

                  <thead>

                    <tr>
                      <th>Subject</th>
                      <th>Academic Year</th>
                      <th>Section</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Actions</th>
                    </tr>

                  </thead>

                  <tbody>

                    {exams.map((exam) => (

                      <tr key={exam._id}>

                        <td>
                          <div className="subject-cell">

                            <div className="subject-icon">
                              {exam.subject
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <strong>
                              {exam.subject}
                            </strong>

                          </div>
                        </td>

                        <td>
                          <span className="year-text">
                            {exam.academicYear}
                          </span>
                        </td>

                        <td>
                          <span className="section-pill">
                            Section {exam.section}
                          </span>
                        </td>

                        <td>
                          {new Date(
                            exam.examDate
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>

                        <td>
                          <span className="time-text">
                            {exam.startTime}
                            {" – "}
                            {exam.endTime}
                          </span>
                        </td>

                        <td>

                          <div className="table-actions">

                            <button
                              className="table-edit"
                              onClick={() =>
                                handleEdit(exam)
                              }
                            >
                              Edit
                            </button>

                            <button
                              className="table-delete"
                              onClick={() =>
                                handleDelete(
                                  exam._id
                                )
                              }
                            >
                              Cancel
                            </button>

                          </div>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </section>

        </main>

      </div>

    </div>
  );
}

export default AdminDashboard;