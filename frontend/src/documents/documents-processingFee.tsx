import { useNavigate } from "react-router-dom";
import "./documents.styles.css";

const ProcessingFeeDocument = () => {
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
        <h1>Processing Fee</h1>
      </div>

      <div className="document-content">
        <div className="document-section">
          <h2>What is a Processing Fee?</h2>
          <p>
            A mandatory payment required for processing your visa extension application. 
            The amount varies depending on your visa type and the requested processing time.
          </p>
        </div>

        <div className="document-section">
          <h2>Requirements</h2>
          <ul>
            <li>Must be paid in Japanese Yen</li>
            <li>Payment method varies by office</li>
            <li>Receipt must be kept for records</li>
            <li>Fee is non-refundable</li>
          </ul>
        </div>

        <div className="document-section">
          <h2>How to Pay</h2>
          <p>
            Payment can be made at the immigration office using cash, credit card, 
            or bank transfer. Some offices also accept online payments.
          </p>
        </div>

        <div className="document-section">
          <h2>Fee Amounts</h2>
          <p>
            Standard processing: ¥4,000, Express processing: ¥8,000. 
            Student and work visas may have different fee structures.
          </p>
        </div>

        <div className="document-section">
          <h2>Important Notes</h2>
          <ul>
            <li>Bring exact change when possible</li>
            <li>Keep payment receipt safe</li>
            <li>Fees may change annually</li>
            <li>Payment is required before processing begins</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProcessingFeeDocument;
