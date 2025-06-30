import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import "./loginPage.styles.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const { login, signup, loginWithGoogle } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);

      if (isSignup) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
    } catch (error: any) {
      setError(
        isSignup
          ? "Failed to create account: " + error.message
          : "Failed to log in: " + error.message
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleAuth() {
    try {
      setError("");
      setLoading(true);
      await loginWithGoogle();
    } catch (error: any) {
      setError("Failed to authenticate with Google: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <img
            src="/src/assets/icons/vizy.svg"
            alt="Vizy Logo"
            className="logo"
          />
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
            {loading
              ? isSignup
                ? "Creating Account..."
                : "Logging in..."
              : isSignup
              ? "Sign Up"
              : "Login"}
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <button
          onClick={handleGoogleAuth}
          className="login-button google"
          disabled={loading}
        >
          <img
            src="https://img.icons8.com/ios-filled/50/FFFFFF/google.png"
            alt="Google"
          />
          Continue with Google
        </button>

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
