import { useNavigate } from "react-router-dom";
import "./documents.styles.css";

const LetterOfGuaranteeDocument = () => {
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
        <h1>Letter of Guarantee</h1>
      </div>

      <div className="document-content">
        <div className="document-section">
          <h2>What is a Letter of Guarantee?</h2>
          <p>
            A letter from a guarantor (usually a parent or sponsor) promising
            financial support for your studies and living expenses in Japan.
          </p>
        </div>

        <div className="document-section">
          <h2>Requirements</h2>
          <ul>
            <li>Must be from a reliable guarantor</li>
            <li>Include guarantor's financial information</li>
            <li>Promise specific amount of support</li>
            <li>Signed by guarantor</li>
            <li>May need to be notarized</li>
          </ul>
        </div>

        <div className="document-section">
          <h2>How to Obtain</h2>
          <p>
            Request from your guarantor (parent, relative, or sponsor). The
            guarantor should write this letter in their own words.
          </p>
        </div>

        <div className="document-section">
          <h2>Processing Time</h2>
          <p>
            Depends on your guarantor's availability. Usually takes 1-2 weeks to
            prepare and notarize if required.
          </p>
        </div>

        <div className="document-section">
          <h2>Important Notes</h2>
          <ul>
            <li>Guarantor should have stable income</li>
            <li>Letter should be in Japanese or English</li>
            <li>Include guarantor's contact information</li>
            <li>May need supporting financial documents</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LetterOfGuaranteeDocument;
