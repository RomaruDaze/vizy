import "./document.styles.css";

const ApplicationForm = () => {
  return (
    <div className="document-content">
      <div className="document-section">
        <h2>Description</h2>
        <p>
          The official application form required by the Immigration Bureau to
          extend your visa.
        </p>
      </div>

      <div className="document-section">
        <h2>Requirements</h2>
        <ul>
          <li>Must be filled out completely and accurately</li>
          <li>Should be submitted before your current visa expires</li>
          <li>Available at immigration offices or online</li>
          <li>Requires your signature and date</li>
        </ul>
      </div>

      <div className="document-section">
        <h2>Tips</h2>
        <ul>
          <li>Keep a copy of your application for your records</li>
          <li>Submit at least 3 months before expiration</li>
          <li>Make sure all information matches your passport</li>
        </ul>
      </div>
    </div>
  );
};

export default ApplicationForm;
