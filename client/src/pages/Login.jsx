import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/login",
        form
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* Decorative background */}

      <div className="login-decoration decoration-one" />
      <div className="login-decoration decoration-two" />
      <div className="login-grid-pattern" />

      <div className="login-container">

        {/* Left branding section */}

        <section className="login-showcase">

          <div className="login-brand">

            <div className="login-brand-mark">
              E
            </div>

            <div>
              <strong>ExamFlow</strong>
              <span>Examination Management</span>
            </div>

          </div>

          <div className="login-showcase-content">

            <span className="login-eyebrow">
              SMARTER EXAM MANAGEMENT
            </span>

            <h1>
              Your exams.
              <br />
              <span>Organized.</span>
            </h1>

            <p>
              A simple and secure platform for
              managing examination schedules and
              accessing your academic timetable.
            </p>

            <div className="login-features">

              <div className="login-feature">
                <div>✓</div>
                <span>Centralized examination schedules</span>
              </div>

              <div className="login-feature">
                <div>✓</div>
                <span>Section-based student timetables</span>
              </div>

              <div className="login-feature">
                <div>✓</div>
                <span>Secure role-based access</span>
              </div>

            </div>

          </div>

          <div className="login-showcase-footer">
            Examination Management System
          </div>

        </section>

        {/* Login section */}

        <section className="login-panel">

          <div className="login-card">

            <div className="mobile-login-brand">

              <div className="login-brand-mark">
                E
              </div>

              <div>
                <strong>ExamFlow</strong>
                <span>Examination Management</span>
              </div>

            </div>

            <div className="login-heading">

              <span>WELCOME BACK</span>

              <h2>Sign in to your account</h2>

              <p>
                Enter your credentials to continue
                to the portal.
              </p>

            </div>

            {error && (
              <div className="login-error">
                <span>!</span>
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="login-field">

                <label htmlFor="email">
                  Email address
                </label>

                <div className="login-input-wrapper">

                  <span className="input-icon">
                    @
                  </span>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />

                </div>

              </div>

              <div className="login-field">

                <div className="login-label-row">

                  <label htmlFor="password">
                    Password
                  </label>

                </div>

                <div className="login-input-wrapper">

                  <span className="input-icon">
                    •
                  </span>

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>

                </div>

              </div>

              <button
                className="login-submit"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="login-button-spinner" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <span>→</span>
                  </>
                )}
              </button>

            </form>

            <div className="login-security">

              <span className="security-icon">
                ✓
              </span>

              <span>
                Secure authentication
              </span>

            </div>

          </div>

          <p className="login-copyright">
            © {new Date().getFullYear()} ExamFlow
            · Examination Management System
          </p>

        </section>

      </div>

    </div>
  );
}

export default Login;