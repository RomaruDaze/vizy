import React from "react";
import "./account.styles.css";

interface AccountProps {
  onBack: () => void;
}

const Account = ({ onBack }: AccountProps) => {
  return (
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
        <h2>Account Information</h2>
        {/* Add your account settings content here */}
      </div>
    </div>
  );
};

export default Account;
