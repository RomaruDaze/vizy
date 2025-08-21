import { useNavigate } from "react-router-dom";
import "./documents.styles.css";

const ScholarshipAwardDocument = () => {
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
        <h1>Scholarship Award</h1>
      </div>

      <div className="document-content">
        <div className="document-section">
          <h2>What is a Scholarship Award Document?</h2>
          <p>
            A document confirming any scholarships or financial aid you are receiving. 
            This shows additional financial support for your studies.
          </p>
        </div>

        <div className="document-section">
          <h2>Requirements</h2>
          <ul>
            <li>Must be from scholarship provider</li>
            <li>Include scholarship amount and duration</li>
            <li>Show recipient name and student ID</li>
            <li>Include terms and conditions</li>
            <li>Must be current and valid</li>
          </ul>
        </div>

        <div className="document-section">
          <h2>How to Obtain</h2>
          <p>
            Request from your scholarship provider, school's financial aid office, 
            or the organization that awarded the scholarship.
          </p>
        </div>

        <div className="document-section">
          <h2>Processing Time</h2>
          <p>
            Usually available within 1-2 weeks, depending on the scholarship 
            provider and their administrative processes.
          </p>
        </div>

        <div className="document-section">
          <h2>Important Notes</h2>
          <ul>
            <li>Ensure scholarship is still active</li>
            <li>Keep copies of all scholarship documents</li>
            <li>Document should be in Japanese or English</li>
            <li>May need to be updated annually</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipAwardDocument;
