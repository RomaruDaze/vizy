import { useNavigate } from "react-router-dom";
import "./documents.styles.css";

const CertificateOfEmploymentDocument = () => {
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
        <h1>Certificate of Employment</h1>
      </div>

      <div className="document-content">
        <div className="document-section">
          <h2>What is a Certificate of Employment?</h2>
          <p>
            An official letter from your employer confirming your employment status, 
            position, salary, and other relevant employment details. Must be on company letterhead.
          </p>
        </div>

        <div className="document-section">
          <h2>Requirements</h2>
          <ul>
            <li>Must be on official company letterhead</li>
            <li>Include your full name and position</li>
            <li>Show current salary and employment duration</li>
            <li>Signed by authorized company representative</li>
            <li>Include company contact information</li>
          </ul>
        </div>

        <div className="document-section">
          <h2>How to Obtain</h2>
          <p>
            Request from your HR department or direct supervisor. Most companies have 
            standard templates for employment certificates.
          </p>
        </div>

        <div className="document-section">
          <h2>Processing Time</h2>
          <p>
            Typically takes 1-3 business days from your employer. Some companies may 
            require advance notice for official documents.
          </p>
        </div>

        <div className="document-section">
          <h2>Important Notes</h2>
          <ul>
            <li>Request well in advance of your application</li>
            <li>Ensure all information is accurate and current</li>
            <li>Keep multiple copies for different applications</li>
            <li>Document should be recent (within 3 months)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CertificateOfEmploymentDocument;
