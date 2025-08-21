import { useNavigate } from "react-router-dom";
import "./documents.styles.css";

const CompanyRegistrationDocument = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/user-guide");
  };

  return (
    <div className="document-page">
      <div className="document-header">
        <button className="back-button" onClick={handleBack}>
          <img
            src="https://img.icons8.com/sf-black-filled/100/FFFFFF/back.png"
            alt="Back"
          />
        </button>
        <h1>Company Registration Certificate</h1>
      </div>

      <div className="document-content">
        <div className="document-section">
          <h2>What is a Company Registration Certificate?</h2>
          <p>
            An official document proving your company is legally registered and
            operating in Japan. This demonstrates the company's legitimacy and
            financial stability.
          </p>
        </div>

        <div className="document-section">
          <h2>Requirements</h2>
          <ul>
            <li>Must be current and valid</li>
            <li>Show company name and registration number</li>
            <li>Include business address and activities</li>
            <li>Show registration date and status</li>
            <li>Must be from official government source</li>
          </ul>
        </div>

        <div className="document-section">
          <h2>How to Obtain</h2>
          <p>
            Request from your company's legal or administrative department. Can
            also be obtained from the Legal Affairs Bureau or local government
            office.
          </p>
        </div>

        <div className="document-section">
          <h2>Processing Time</h2>
          <p>
            Company copies are usually available immediately. Official copies
            from government offices may take 1-2 weeks.
          </p>
        </div>

        <div className="document-section">
          <h2>Important Notes</h2>
          <ul>
            <li>Ensure document is not expired</li>
            <li>Verify all company details are correct</li>
            <li>Keep both digital and physical copies</li>
            <li>Document should be in Japanese or with translation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CompanyRegistrationDocument;
