import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import LanguageButton from "../shared/LanguageButton";
import "./signupPage.styles.css";
import { updateProfile } from "firebase/auth";

const SignupPage = () => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup, loginWithGoogle } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Compute form validity
  const isFormValid =
    nickname.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length >= 6 &&
    confirmPassword.length >= 6 &&
    password === confirmPassword &&
    agreeToTerms;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validation
    if (!nickname.trim()) {
      return setError(t("nickname_required"));
    }

    if (password !== confirmPassword) {
      return setError(t("passwords_dont_match"));
    }

    if (password.length < 6) {
      return setError(t("password_too_short"));
    }

    if (!agreeToTerms) {
      return setError(t("must_agree_terms"));
    }

    try {
      setError("");
      setLoading(true);

      // Create the user account
      const userCredential = await signup(email, password);

      // Update the user's display name with the nickname
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: nickname.trim(),
        });
      }

      // Redirect to home page after successful signup
      navigate("/");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t("failed_create_account");
      setError(t("failed_create_account") + ": " + errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignup() {
    try {
      setError("");
      setLoading(true);
      await loginWithGoogle();
      // Redirect to home page after successful signup
      navigate("/");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t("failed_google_signup");
      setError(t("failed_google_signup") + ": " + errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-header">
          <h1>{t("create_account")}</h1>
          <p>{t("join_vizy_message")}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="nickname">{t("nickname")}</label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              placeholder={t("enter_nickname")}
            />
          </div>

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

          <div className="form-group">
            <label htmlFor="confirmPassword">{t("confirm_password")}</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder={t("re_enter_password")}
              minLength={6}
            />
          </div>

          <div className="terms-checkbox">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
              />
              <span className="checkmark"></span>
              {t("i_agree_to")}{" "}
              <button
                type="button"
                className="terms-link"
                onClick={() => setShowTerms(true)}
              >
                {t("terms_of_service")}
              </button>
            </label>
          </div>

          <button
            type="submit"
            className="signup-button primary"
            disabled={loading || !isFormValid}
            aria-label={t("create_account")}
            aria-disabled={loading || !isFormValid}
          >
            {loading ? t("creating_account") : t("create_account")}
          </button>
        </form>

        <div className="divider">
          <span>{t("or")}</span>
        </div>

        <div className="button-container">
          <button
            onClick={handleGoogleSignup}
            className="signup-button google"
            disabled={loading}
          >
            <img
              src="https://img.icons8.com/color/480/google-logo.png"
              alt="Google"
            />
            {t("continue_with_google")}
          </button>
        </div>

        <div className="signup-footer">
          <p>
            {t("already_have_account")}{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="link-button"
            >
              {t("log_in")}
            </button>
          </p>
        </div>
      </div>

      {/* Terms of Service Modal */}
      {showTerms && (
        <div className="terms-overlay">
          <div className="terms-modal">
            <div className="terms-header">
              <h3>{t("terms_of_service")}</h3>
              <button
                className="close-button"
                onClick={() => setShowTerms(false)}
              >
                ×
              </button>
            </div>
            <div className="terms-content">
              <h4>{t("welcome_to_vizy")}</h4>
              <p>{t("terms_agreement")}</p>

              <h5>1. {t("service_description_title")}</h5>
              <p>{t("service_description")}</p>

              <h5>2. {t("user_responsibilities_title")}</h5>
              <p>{t("you_are_responsible_for")}</p>
              <ul>
                <li>{t("providing_accurate_info")}</li>
                <li>{t("maintaining_account_security")}</li>
                <li>{t("using_service_compliance")}</li>
              </ul>

              <h5>3. {t("privacy")}</h5>
              <p>{t("privacy_description")}</p>

              <h5>4. {t("limitation_of_liability")}</h5>
              <p>{t("liability_description")}</p>

              <h5>5. {t("changes_to_terms")}</h5>
              <p>{t("terms_changes_description")}</p>

              <p>
                <strong>{t("last_updated")}:</strong>{" "}
                {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="terms-footer">
              <button
                className="signup-button primary"
                onClick={() => {
                  setAgreeToTerms(true);
                  setShowTerms(false);
                }}
              >
                {t("i_understand")}
              </button>
            </div>
          </div>
        </div>
      )}

      <LanguageButton />
    </div>
  );
};

export default SignupPage;
