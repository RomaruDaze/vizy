import { useNavigate } from "react-router-dom";
import "./documents.styles.css";

const FamilyPassportDocument = () => {
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
        <h1>Family Passport</h1>
      </div>

      <div className="document-content">
        <div className="document-section">
          <h2>What is a Family Passport?</h2>
          <p>
            The passport of the family member applying for the visa extension. 
            This document proves the family member's identity and nationality.
          </p>
        </div>

        <div className="document-section">
          <h2>Requirements</h2>
          <ul>
            <li>Must be valid for at least 6 months</li>
            <li>Should have at least 2 blank pages</li>
            <li>Must be in good condition</li>
            <li>Show current photo and information</li>
            <li>Include all family members' passports</li>
          </ul>
        </div>

        <div className="document-section">
          <h2>How to Obtain</h2>
          <p>
            Contact your home country's embassy or consulate in Japan, or visit 
            the passport office in your home country if you're there.
          </p>
        </div>

        <div className="document-section">
          <h2>Processing Time</h2>
          <p>
            Standard processing: 4-6 weeks. Expedited service: 2-3 weeks. 
            Emergency passports: 24-48 hours.
          </p>
        </div>

        <div className="document-section">
          <h2>Important Notes</h2>
          <ul>
            <li>Check validity for all family members</li>
            <li>Ensure sufficient blank pages</li>
            <li>Keep photocopies in safe place</li>
            <li>Report loss or theft immediately</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FamilyPassportDocument;
