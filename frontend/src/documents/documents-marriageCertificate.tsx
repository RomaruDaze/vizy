


import { useNavigate } from "react-router-dom";
import "./documents.styles.css";

const MarriageCertificateDocument = () => {
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
        <h1>Marriage Certificate</h1>
      </div>

      <div className="document-content">
        <div className="document-section">
          <h2>What is a Marriage Certificate?</h2>
          <p>
            An official marriage certificate translated into Japanese and authenticated 
            by your embassy. This proves your marital status for visa applications.
          </p>
        </div>

        <div className="document-section">
          <h2>Requirements</h2>
          <ul>
            <li>Must be original or certified copy</li>
            <li>Translated into Japanese</li>
            <li>Authenticated by your embassy</li>
            <li>Include both spouses' names</li>
            <li>Show marriage date and location</li>
          </ul>
        </div>

        <div className="document-section">
          <h2>How to Obtain</h2>
          <p>
            Request from your home country's vital records office, then have it 
            translated and authenticated by your embassy in Japan.
          </p>
        </div>

        <div className="document-section">
          <h2>Processing Time</h2>
          <p>
            Obtaining the original: 2-4 weeks. Translation and authentication: 
            1-2 weeks. Total: 3-6 weeks.
          </p>
        </div>

        <div className="document-section">
          <h2>Important Notes</h2>
          <ul>
            <li>Start the process early</li>
            <li>Use certified translators</li>
            <li>Keep multiple copies</li>
            <li>Document should be recent (within 1 year)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MarriageCertificateDocument;