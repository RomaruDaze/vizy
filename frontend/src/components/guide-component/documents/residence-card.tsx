import "./document.styles.css";

const ResidenceCard = () => {
  return (
    <div className="document-content">
      <div className="document-section">
        <h2>Description</h2>
        <p>
          Your current residence card (在留カード) issued by the Japanese
          government.
        </p>
      </div>

      <div className="document-section">
        <h2>Requirements</h2>
        <ul>
          <li>Must be current and valid</li>
          <li>Should not be expired</li>
          <li>Must be in good condition</li>
          <li>Should match your current address</li>
        </ul>
      </div>

      <div className="document-section">
        <h2>Tips</h2>
        <ul>
          <li>Update your address within 14 days of moving</li>
          <li>Carry it with you at all times</li>
          <li>Report any changes to immigration</li>
        </ul>
      </div>
    </div>
  );
};

export default ResidenceCard;
