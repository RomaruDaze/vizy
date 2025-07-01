import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import "./auth.styles.css";

interface SignupProps {
  onSwitchToLogin: () => void;
  onClose: () => void;
}

const Signup = ({ onSwitchToLogin, onClose }: SignupProps) => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup, loginWithGoogle } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validation
    if (!firstName.trim()) {
      return setError("First name is required");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters long");
    }

    if (!agreeToTerms) {
      return setError("You must agree to the Terms of Service");
    }

    try {
      setError("");
      setLoading(true);
      await signup(email, password);
      onClose();
    } catch (error: any) {
      setError("Failed to create an account: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignup() {
    try {
      setError("");
      setLoading(true);
      await loginWithGoogle();
      onClose();
    } catch (error: any) {
      setError("Failed to sign up with Google: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-overlay">
      <div className="auth-modal signup-modal">
        <div className="auth-header">
          <h2>Create Account</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              placeholder="Enter your first name"
            />
          </div>

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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Re-enter your password"
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
              I agree to the{' '}
              <button 
                type="button"
                className="terms-link" 
                onClick={() => setShowTerms(true)}
              >
                Terms of Service
              </button>
            </label>
          </div>

          <button
            type="submit"
            className="auth-button primary"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button
          onClick={handleGoogleSignup}
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
            Already have an account?{" "}
            <button className="link-button" onClick={onSwitchToLogin}>
              Log in
            </button>
          </p>
        </div>
      </div>

      {/* Terms of Service Modal */}
      {showTerms && (
        <div className="terms-overlay">
          <div className="terms-modal">
            <div className="terms-header">
              <h3>Terms of Service</h3>
              <button 
                className="close-button" 
                onClick={() => setShowTerms(false)}
              >
                ×
              </button>
            </div>
            <div className="terms-content">
              <h4>Welcome to Vizy</h4>
              <p>By using our service, you agree to the following terms:</p>
              
              <h5>1. Service Description</h5>
              <p>Vizy is an immigration assistant application designed to help users find immigration offices and photo booths in Japan.</p>
              
              <h5>2. User Responsibilities</h5>
              <p>You are responsible for:</p>
              <ul>
                <li>Providing accurate information</li>
                <li>Maintaining the security of your account</li>
                <li>Using the service in compliance with local laws</li>
              </ul>
              
              <h5>3. Privacy</h5>
              <p>We collect and process your data in accordance with our Privacy Policy. Your personal information is protected and will not be shared with third parties without your consent.</p>
              
              <h5>4. Limitation of Liability</h5>
              <p>Vizy provides information for reference purposes only. We are not responsible for any decisions made based on the information provided through our service.</p>
              
              <h5>5. Changes to Terms</h5>
              <p>We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of any changes.</p>
              
              <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
            </div>
            <div className="terms-footer">
              <button 
                className="auth-button primary"
                onClick={() => setShowTerms(false)}
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
 