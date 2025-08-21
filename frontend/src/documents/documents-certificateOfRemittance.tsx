import { useNavigate } from "react-router-dom";
import "./documents.styles.css";

const CertificateOfRemittanceDocument = () => {
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
        <h1>Certificate of Remittance</h1>
      </div>

      <div className="document-content">
        <div className="document-section">
          <h2>What is a Certificate of Remittance?</h2>
          <p>
            Proof of money transfers from your home country to support your studies. 
            This demonstrates financial support from abroad.
          </p>
        </div>

        <div className="document-section">
          <h2>Requirements</h2>
          <ul>
            <li>Must be from your bank or money transfer service</li>
            <li>Show sender and recipient names</li>
            <li>Include transfer amount and date</li>
            <li>Show transfer reference number</li>
            <li>Must be recent (within 6 months)</li>
          </ul>
        </div>

        <div className="document-section">
          <h2>How to Obtain</h2>
          <p>
            Request from your bank or money transfer service. Most providers 
            can provide this document immediately or within a few days.
          </p>
        </div>

        <div className="document-section">
          <h2>Processing Time</h2>
          <p>
            Usually available immediately at banks or within 1-2 business days 
            for online requests.
          </p>
        </div>

        <div className="document-section">
          <h2>Important Notes</h2>
          <ul>
            <li>Keep all transfer receipts</li>
            <li>Ensure transfers are regular and sufficient</li>
            <li>Document should be in Japanese or English</li>
            <li>May need to be notarized for official use</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CertificateOfRemittanceDocument;
