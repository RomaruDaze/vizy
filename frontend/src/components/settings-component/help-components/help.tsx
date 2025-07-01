import "../account-components/account.styles.css";

interface HelpProps {
  onBack: () => void;
}

const Help = ({ onBack }: HelpProps) => (
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
      <h2>Help & Support</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li>
          <strong>FAQ</strong>
          <p>Find answers to frequently asked questions.</p>
        </li>
        <li>
          <strong>Contact Support</strong>
          <p>Get in touch with our support team.</p>
        </li>
        <li>
          <strong>User Guide</strong>
          <p>Learn how to use the app effectively.</p>
        </li>
        <li>
          <strong>Report a Bug</strong>
          <p>Report any issues you encounter.</p>
        </li>
        <li>
          <strong>Feature Request</strong>
          <p>Suggest new features for the app.</p>
        </li>
      </ul>
    </div>
  </div>
);

export default Help;
