import { useNavigate } from "react-router-dom";
import "./documents.styles.css";

const ResidentTaxDocument = () => {
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
        <h1>Resident Tax Certificate</h1>
      </div>

      <div className="document-content">
        <div className="document-section">
          <h2>What is a Resident Tax Certificate?</h2>
          <p>
            A certificate showing you have paid your resident tax obligations for the 
            previous year. This document proves your compliance with local tax requirements.
          </p>
        </div>

        <div className="document-section">
          <h2>Requirements</h2>
          <ul>
            <li>Must be for the most recent tax year</li>
            <li>Show your name and address</li>
            <li>Include tax amount and payment status</li>
            <li>Must be from your local government office</li>
            <li>Should be in Japanese or with translation</li>
          </ul>
        </div>

        <div className="document-section">
          <h2>How to Obtain</h2>
          <p>
            Request from your local city hall or ward office. You can usually get this 
            document immediately or within a few days.
          </p>
        </div>

        <div className="document-section">
          <h2>Processing Time</h2>
          <p>
            Usually available immediately at city hall. Some offices may require 
            1-2 business days for processing.
          </p>
        </div>

        <div className="document-section">
          <h2>Important Notes</h2>
          <ul>
            <li>Bring your residence card or ID</li>
            <li>Request for the correct tax year</li>
            <li>Keep copies for your records</li>
            <li>Document is valid for 3 months</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResidentTaxDocument;
