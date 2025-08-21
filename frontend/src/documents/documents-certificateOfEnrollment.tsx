import { useNavigate } from "react-router-dom";
import "./documents.styles.css";

const CertificateOfEnrollmentDocument = () => {
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
        <h1>Certificate of Enrollment</h1>
      </div>

      <div className="document-content">
        <div className="document-section">
          <h2>What is a Certificate of Enrollment?</h2>
          <p>
            A letter from your school confirming your enrollment status and expected 
            graduation date. This document proves you are actively studying in Japan.
          </p>
        </div>

        <div className="document-section">
          <h2>Requirements</h2>
          <ul>
            <li>Must be on official school letterhead</li>
            <li>Include your full name and student ID</li>
            <li>Show current enrollment status</li>
            <li>Include expected graduation date</li>
            <li>Signed by school official</li>
          </ul>
        </div>

        <div className="document-section">
          <h2>How to Obtain</h2>
          <p>
            Request from your school's student affairs office or international 
            student center. Most schools have standard templates for this document.
          </p>
        </div>

        <div className="document-section">
          <h2>Processing Time</h2>
          <p>
            Usually available within 1-3 business days. Some schools may require 
            advance notice for official documents.
          </p>
        </div>

        <div className="document-section">
          <h2>Important Notes</h2>
          <ul>
            <li>Request well in advance of your application</li>
            <li>Ensure all information is current and accurate</li>
            <li>Keep multiple copies for different applications</li>
            <li>Document should be recent (within 3 months)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CertificateOfEnrollmentDocument;
