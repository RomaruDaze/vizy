// frontend/src/components/settings-component/privacy-security.tsx
import "../account-components/account.styles.css";

interface PrivacySecurityProps {
  onBack: () => void;
}

const PrivacySecurity = ({ onBack }: PrivacySecurityProps) => (
  <div className="account-container">
    <div className="section-header">
      <button className="back-button" onClick={onBack}>
        <img
          src="https://img.icons8.com/ios-filled/50/0078d4/back.png"
          alt="back"
        />
        Back
      </button>
    </div>
    <div className="account-content">
      <h2>Privacy & Security</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li>
          <strong>Password</strong>
          <p>Change your account password.</p>
        </li>
        <li>
          <strong>Two-Factor Authentication</strong>
          <p>Enable or manage 2FA for extra security.</p>
        </li>
        <li>
          <strong>App Permissions</strong>
          <p>Manage what data the app can access.</p>
        </li>
        <li>
          <strong>Data Sharing</strong>
          <p>Control how your data is shared with third parties.</p>
        </li>
        <li>
          <strong>Delete Account</strong>
          <p>Permanently delete your account and data.</p>
        </li>
      </ul>
    </div>
  </div>
);

export default PrivacySecurity;
