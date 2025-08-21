import { useNavigate } from "react-router-dom";
import "./documents.styles.css";

const ResidenceCardDocument = () => {
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
        <h1>Residence Card</h1>
      </div>

      <div className="document-content">
        <div className="document-section">
          <h2>What is a Residence Card?</h2>
          <p>
            A residence card (在留カード) is an official identification document
            issued by the Immigration Bureau that proves your legal status and
            residence in Japan.
          </p>
        </div>

        <div className="document-section">
          <h2>Requirements</h2>
          <ul>
            <li>Must be valid and not expired</li>
            <li>Should show current address and visa status</li>
            <li>Must be in good condition</li>
            <li>Should be carried at all times</li>
          </ul>
        </div>

        <div className="document-section">
          <h2>How to Obtain</h2>
          <p>
            Issued automatically when you first enter Japan or when your visa
            status changes. Renewal is handled at your local immigration office.
          </p>
        </div>

        <div className="document-section">
          <h2>Processing Time</h2>
          <p>
            New cards are typically issued within 2-4 weeks. Renewals can take
            1-2 weeks if all documents are in order.
          </p>
        </div>

        <div className="document-section">
          <h2>Important Notes</h2>
          <ul>
            <li>Report address changes within 14 days</li>
            <li>Report loss or theft immediately</li>
            <li>Keep your card secure and clean</li>
            <li>Renew before expiration date</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResidenceCardDocument;
