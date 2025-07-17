import "./document.styles.css";

const ResidenceCard = () => {
  return (
    <div className="document-content">
      <div className="residence-card-header">
        <div className="card-icon">
          <img 
            src="https://img.icons8.com/ios-filled/100/FFFFFF/id-verified.png" 
            alt="Residence Card"
          />
        </div>
        <h2>Residence Card (在留カード)</h2>
        <p>Your residence card is your primary identification document in Japan</p>
      </div>
      
      <div className="checklist-container">
        <h3>Residence Card Checklist</h3>
        
        <div className="checklist-item">
          <div className="checklist-icon">✅</div>
          <div className="checklist-text">
            <h4>Valid and Current</h4>
            <p>Your residence card must not be expired and should be in good condition</p>
          </div>
        </div>
        
        <div className="checklist-item">
          <div className="checklist-icon">✅</div>
          <div className="checklist-text">
            <h4>Correct Address</h4>
            <p>The address on your residence card must match your current address</p>
          </div>
        </div>
        
        <div className="checklist-item">
          <div className="checklist-icon">✅</div>
          <div className="checklist-text">
            <h4>No Damage</h4>
            <p>The card should not be torn, bent, or have any illegible information</p>
          </div>
        </div>
        
        <div className="checklist-item">
          <div className="checklist-icon">✅</div>
          <div className="checklist-text">
            <h4>Updated Information</h4>
            <p>All personal information should be current and accurate</p>
          </div>
        </div>
      </div>
      
      <div className="important-notes">
        <h3>Important Reminders</h3>
        <div className="note-item">
          <span className="note-icon">��</span>
          <p>Update your address within 14 days of moving</p>
        </div>
        <div className="note-item">
          <span className="note-icon">��</span>
          <p>Carry your residence card with you at all times</p>
        </div>
        <div className="note-item">
          <span className="note-icon">��</span>
          <p>Report any changes to immigration immediately</p>
        </div>
      </div>
    </div>
  );
};

export default ResidenceCard; 