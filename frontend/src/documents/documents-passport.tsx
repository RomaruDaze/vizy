import { useNavigate } from "react-router-dom";
import "./documents.styles.css";

const PassportDocument = () => {
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
        <h1>Passport</h1>
      </div>

      <div className="document-content">
        <div className="document-section">
          <h2>What is a Passport?</h2>
          <p>
            A passport is an official travel document issued by your home
            country's government that serves as proof of your identity and
            nationality when traveling internationally.
          </p>
        </div>

        <div className="document-section">
          <h2>Requirements</h2>
          <ul>
            <li>
              Must be valid for at least 6 months beyond your intended stay
            </li>
            <li>Should have at least 2 blank pages for visa stamps</li>
            <li>
              Must be in good condition (no tears, water damage, or excessive
              wear)
            </li>
            <li>Should be a machine-readable passport (issued after 2006)</li>
          </ul>
        </div>

        <div className="document-section">
          <h2>How to Obtain</h2>
          <p>
            Contact your home country's embassy or consulate in your current
            location, or visit the passport office in your home country if
            you're there.
          </p>
        </div>

        <div className="document-section">
          <h2>Processing Time</h2>
          <p>
            Standard processing typically takes 4-6 weeks, while expedited
            service can take 2-3 weeks. Emergency passports may be available in
            24-48 hours.
          </p>
        </div>

        <div className="document-section">
          <h2>Important Notes</h2>
          <ul>
            <li>Keep a photocopy of your passport in a safe place</li>
            <li>Report lost or stolen passports immediately</li>
            <li>Check visa requirements for your destination country</li>
            <li>Ensure your passport photo meets current standards</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PassportDocument;
