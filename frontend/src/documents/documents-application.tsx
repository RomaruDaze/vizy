import { useNavigate } from "react-router-dom";
import "./documents.styles.css";

const ApplicationDocument = () => {
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
        <h1>Application Extension Form</h1>
      </div>

      <div className="document-content">
        <div className="document-section">
          <h2>What is an Application Extension Form?</h2>
          <p>
            An official form required by the Immigration Bureau for extending your stay in Japan. 
            This form must be filled out completely and accurately with all required information.
          </p>
        </div>

        <div className="document-section">
          <h2>Requirements</h2>
          <ul>
            <li>Must be filled out in Japanese or English</li>
            <li>All fields must be completed accurately</li>
            <li>Must be signed by the applicant</li>
            <li>Should be submitted with all supporting documents</li>
          </ul>
        </div>

        <div className="document-section">
          <h2>How to Obtain</h2>
          <p>
            Download from the Immigration Bureau website, pick up at your local immigration office, 
            or request by mail. Forms are available in multiple languages.
          </p>
        </div>

        <div className="document-section">
          <h2>Processing Time</h2>
          <p>
            Form processing is included in the overall visa extension timeline. 
            Complete forms are typically processed within 2-4 weeks.
          </p>
        </div>

        <div className="document-section">
          <h2>Important Notes</h2>
          <ul>
            <li>Use black or blue ink only</li>
            <li>Make copies before submitting</li>
            <li>Keep a copy for your records</li>
            <li>Submit well before your current visa expires</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDocument;