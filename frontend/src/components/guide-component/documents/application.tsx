import "./document.styles.css";

const Application = () => {
  return (
    <div className="document-content">
      <div className="application-header">
        <div className="application-icon">
          <img
            src="https://img.icons8.com/ios-filled/100/FFFFFF/document.png"
            alt="Application Form"
          />
        </div>
        <h2>Application for Extension of Period of Stay</h2>
      </div>

      <div className="application-steps">
        <h3>How to Fill Out the Application</h3>

        <div className="step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h4>Personal Information</h4>
            <p>
              Fill in your full name, date of birth, nationality, and current
              address exactly as they appear on your passport and residence
              card.
            </p>
          </div>
        </div>

        <div className="step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h4>Visa Information</h4>
            <p>
              Enter your current visa type, expiration date, and the reason for
              your extension request.
            </p>
          </div>
        </div>

        <div className="step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h4>Supporting Documents</h4>
            <p>
              List all the documents you are submitting with your application.
              Make sure to include all required documents.
            </p>
          </div>
        </div>

        <div className="step">
          <div className="step-number">4</div>
          <div className="step-content">
            <h4>Signature and Date</h4>
            <p>
              Sign the application and write the current date. Your signature
              must match the one on your passport.
            </p>
          </div>
        </div>
      </div>

      <div className="application-tips">
        <h3>Tips for Success</h3>
        <ul>
          <li>Use black or blue ink only</li>
          <li>Write clearly and legibly</li>
          <li>Don't leave any sections blank</li>
          <li>Double-check all information before submitting</li>
          <li>Keep a copy of your completed application</li>
        </ul>
      </div>
    </div>
  );
};

export default Application;
