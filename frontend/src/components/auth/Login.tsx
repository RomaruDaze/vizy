import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getErrorMessage } from "../../utils/firebaseErrors";
import "./auth.styles.css";

interface LoginProps {
  onSwitchToSignup: () => void;
  onClose: () => void;
}

const Login = ({ onSwitchToSignup, onClose }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(email, password);
      onClose();
    } catch (error) {
      setError("Failed to log in: " + getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      setError("");
      setLoading(true);
      await loginWithGoogle();
      onClose();
    } catch (error) {
      setError("Failed to log in with Google: " + getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <div className="auth-header">
          <h2>Login</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
            />
          </div>

          <button
            type="submit"
            className="auth-button primary"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="auth-button google"
          disabled={loading}
        >
          <img
            src="https://img.icons8.com/ios-filled/50/FFFFFF/google.png"
            alt="Google"
          />
          Continue with Google
        </button>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <button className="link-button" onClick={onSwitchToSignup}>
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
 