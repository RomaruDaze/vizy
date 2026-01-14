import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import LanguageButton from "../shared/LanguageButton";
import "./loginPage.styles.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle, currentUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
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
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t("failed_to_login");
      setError(t("failed_to_login") + ": " + errorMessage);
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
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t("failed_google_auth");
      setError(t("failed_google_auth") + ": " + errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // Don't render login form if user is already authenticated
  if (currentUser) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div>{t("redirecting")}</div>
        </div>
        <LanguageButton />
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <img src="./vizy.png" alt="Vizy Logo" className="logo" />
          <h1>{t("welcome_to_vizy")}</h1>
          <p>{t("your_immigration_assistant")}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">{t("email")}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={t("enter_email")}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t("password")}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={t("enter_password")}
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="login-button primary"
            disabled={loading}
          >
            {loading ? t("logging_in") : t("login")}
          </button>
        </form>

        <div className="divider">
          <span>{t("or")}</span>
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
            {t("continue_with_google")}
          </button>
        </div>

        <div className="login-footer">
          <p>
            {t("dont_have_account")}{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="link-button"
            >
              {t("sign_up")}
            </button>
          </p>
        </div>
      </div>

      <LanguageButton />
    </div>
  );
};

export default LoginPage;
