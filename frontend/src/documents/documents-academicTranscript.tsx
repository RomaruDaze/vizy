import { useNavigate } from "react-router-dom";
import "./documents.styles.css";

const AcademicTranscriptDocument = () => {
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
        <h1>Academic Transcript</h1>
      </div>

      <div className="document-content">
        <div className="document-section">
          <h2>What is an Academic Transcript?</h2>
          <p>
            An official transcript showing your academic performance and attendance 
            record. This document demonstrates your academic progress and commitment to studies.
          </p>
        </div>

        <div className="document-section">
          <h2>Requirements</h2>
          <ul>
            <li>Must be official and sealed</li>
            <li>Include all completed courses and grades</li>
            <li>Show attendance records</li>
            <li>Include GPA or academic standing</li>
            <li>Must be in Japanese or with translation</li>
          </ul>
        </div>

        <div className="document-section">
          <h2>How to Obtain</h2>
          <p>
            Request from your school's registrar or student affairs office. 
            Some schools may charge a fee for official transcripts.
          </p>
        </div>

        <div className="document-section">
          <h2>Processing Time</h2>
          <p>
            Usually takes 3-5 business days. Some schools may require 
            advance notice for official transcripts.
          </p>
        </div>

        <div className="document-section">
          <h2>Important Notes</h2>
          <ul>
            <li>Request multiple copies for different applications</li>
            <li>Ensure transcript is current and complete</li>
            <li>Keep sealed copies for official use</li>
            <li>Document should be recent (within 6 months)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AcademicTranscriptDocument;
