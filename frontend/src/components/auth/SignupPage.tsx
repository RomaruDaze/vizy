import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validation
    if (!nickname.trim()) {
      return setError("Nickname is required");
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
      
      // Create the user account
      const userCredential = await signup(email, password);
      
      // Update the user's display name with the nickname
      if (userCredential.user) {
        await updateProfile(userCredential.user, { 
          displayName: nickname.trim() 
        });
      }

      // Redirect to home page after successful signup
      window.location.href = "/vizy/";
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
      // Redirect to home page after successful signup
      window.location.href = "/vizy/";
    } catch (error: any) {
      setError("Failed to sign up with Google: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-header">
          <h1>Create Your Account</h1>
          <p>Join Vizy and start your immigration journey</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="nickname">Nickname</label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              placeholder="Enter your nickname"
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
            className="signup-button primary"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="divider">
          <span>or</span>
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
            Continue with Google
          </button>
        </div>

        <div className="signup-footer">
          <p>
            Already have an account?{' '}
            <a href="/login" className="link-button">
              Log in
            </a>
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
                className="signup-button primary"
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

export default SignupPage;
 
