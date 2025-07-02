import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./loginPage.styles.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      console.log("User already logged in, redirecting to home");
      navigate("/");
    }
  }, [currentUser, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(email, password);
      // Navigation will be handled by the useEffect above
    } catch (error: any) {
      setError("Failed to log in: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleAuth() {
    try {
      setError("");
      setLoading(true);
      await loginWithGoogle();
      // Navigation will be handled by the useEffect above
    } catch (error: any) {
      setError("Failed to authenticate with Google: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  // Don't render login form if user is already authenticated
  if (currentUser) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div>Redirecting...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <img src="./vizy.svg" alt="Vizy Logo" className="logo" />
          <h1>Welcome to Vizy</h1>
          <p>Your immigration assistant</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="login-button primary"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <div className="button-container">
          <button
            onClick={handleGoogleAuth}
            className="login-button google"
            disabled={loading}
          >
            <img
              src="https://img.icons8.com/color/480/google-logo.png"
              alt="Google"
            />
            Continue with Google
          </button>
        </div>

        <div className="login-footer">
          <p>
            Don't have an account?{" "}
            <a href="/vizy/signup" className="link-button">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
