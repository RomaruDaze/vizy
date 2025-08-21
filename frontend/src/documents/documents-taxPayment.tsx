import { useNavigate } from "react-router-dom";
import "./documents.styles.css";

const TaxPaymentDocument = () => {
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
        <h1>Tax Payment Certificate</h1>
      </div>

      <div className="document-content">
        <div className="document-section">
          <h2>What is a Tax Payment Certificate?</h2>
          <p>
            Proof of income tax payments for the previous year. This document shows 
            your compliance with national tax obligations and financial responsibility.
          </p>
        </div>

        <div className="document-section">
          <h2>Requirements</h2>
          <ul>
            <li>Must be for the most recent tax year</li>
            <li>Show your name and tax identification number</li>
            <li>Include total income and tax paid</li>
            <li>Must be from the National Tax Agency</li>
            <li>Should be in Japanese or with translation</li>
          </ul>
        </div>

        <div className="document-section">
          <h2>How to Obtain</h2>
          <p>
            Request from your local tax office or the National Tax Agency. You can 
            also access this information online through the tax agency website.
          </p>
        </div>

        <div className="document-section">
          <h2>Processing Time</h2>
          <p>
            Usually available immediately at tax offices. Online requests may take 
            1-2 business days for processing.
          </p>
        </div>

        <div className="document-section">
          <h2>Important Notes</h2>
          <ul>
            <li>Bring your residence card or ID</li>
            <li>Request for the correct tax year</li>
            <li>Keep copies for your records</li>
            <li>Document is valid for 6 months</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TaxPaymentDocument;
