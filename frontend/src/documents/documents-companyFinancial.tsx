import { useNavigate } from "react-router-dom";
import "./documents.styles.css";

const CompanyFinancialDocument = () => {
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
        <h1>Company Financial Documents</h1>
      </div>

      <div className="document-content">
        <div className="document-section">
          <h2>What are Company Financial Documents?</h2>
          <p>
            Financial statements and records showing your company's financial
            stability and ability to pay your salary. These documents
            demonstrate the company's financial health and sustainability.
          </p>
        </div>

        <div className="document-section">
          <h2>Requirements</h2>
          <ul>
            <li>Recent financial statements (within 1 year)</li>
            <li>Profit and loss statements</li>
            <li>Balance sheets</li>
            <li>Cash flow statements</li>
            <li>Audit reports if available</li>
          </ul>
        </div>

        <div className="document-section">
          <h2>How to Obtain</h2>
          <p>
            Request from your company's finance or accounting department. These
            documents are typically prepared by the company's accountants or
            financial advisors.
          </p>
        </div>

        <div className="document-section">
          <h2>Processing Time</h2>
          <p>
            Usually available within 1-2 weeks, depending on company size and
            financial reporting schedule.
          </p>
        </div>

        <div className="document-section">
          <h2>Important Notes</h2>
          <ul>
            <li>Ensure documents are recent and accurate</li>
            <li>Verify all financial figures are current</li>
            <li>Keep confidential financial information secure</li>
            <li>Documents should be properly formatted and legible</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CompanyFinancialDocument;