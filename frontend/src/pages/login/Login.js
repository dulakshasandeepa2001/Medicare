import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ Use login function from AuthContext
      const result = await login(username, password);

      if (result.success) {
        console.log("✅ Login successful:", result.user);
        console.log("👨‍⚕️ Doctor ID:", result.user.doctorID);
        navigate("/dashboard");
      } else {
        setError(result.error || "❌ Invalid username or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("❌ An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-header">
          <div className="logo-icon">🏥</div>
          <h1>Medicare</h1>
          <p className="login-subtitle">Healthcare Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">👤</span>
              Username
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">🔒</span>
              Password
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              <span>Remember me</span>
            </label>
            <a href="#forgot" className="forgot-link">
              Forgot Password?
            </a>
          </div>

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              <>Sign In</>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{" "}
            <a href="/signup" className="signup-link">
              Sign Up
            </a>
          </p>
          <div className="footer-info">
            <span>© 2024 Medicare. All rights reserved.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
