import { useNavigate } from "react-router-dom";
import "./documents.styles.css";

const BankBalanceDocument = () => {
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
        <h1>Bank Balance Certificate</h1>
      </div>

      <div className="document-content">
        <div className="document-section">
          <h2>What is a Bank Balance Certificate?</h2>
          <p>
            A certificate showing you have sufficient funds to support your studies 
            and living expenses in Japan. This proves your financial capability.
          </p>
        </div>

        <div className="document-section">
          <h2>Requirements</h2>
          <ul>
            <li>Must be from a recognized bank</li>
            <li>Show current account balance</li>
            <li>Include account holder name</li>
            <li>Show account number (can be partially hidden)</li>
            <li>Must be recent (within 1 month)</li>
          </ul>
        </div>

        <div className="document-section">
          <h2>How to Obtain</h2>
          <p>
            Request from your bank branch. Most banks provide this service 
            immediately or within 1-2 business days.
          </p>
        </div>

        <div className="document-section">
          <h2>Processing Time</h2>
          <p>
            Usually available immediately at bank branches. Some banks may 
            require advance notice for official documents.
          </p>
        </div>

        <div className="document-section">
          <h2>Important Notes</h2>
          <ul>
            <li>Ensure sufficient funds are maintained</li>
            <li>Keep account active during application process</li>
            <li>Document should be in Japanese or English</li>
            <li>May need to be notarized for official use</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BankBalanceDocument;
