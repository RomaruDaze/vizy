import { useNavigate } from "react-router-dom";
import "./documents.styles.css";

const IdPhotoDocument = () => {
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
        <h1>ID Photo</h1>
      </div>

      <div className="document-content">
        <div className="document-section">
          <h2>What is an ID Photo?</h2>
          <p>
            A recent passport-style photograph that meets specific requirements for official 
            documents. Must be taken within the last 3 months and show your full face clearly.
          </p>
        </div>

        <div className="document-section">
          <h2>Requirements</h2>
          <ul>
            <li>Size: 4cm x 3cm (40mm x 30mm)</li>
            <li>Taken within the last 3 months</li>
            <li>Plain white or light background</li>
            <li>Full face view, neutral expression</li>
            <li>No glasses, hats, or accessories</li>
          </ul>
        </div>

        <div className="document-section">
          <h2>How to Obtain</h2>
          <p>
            Visit a photo booth at train stations, convenience stores, or photo studios. 
            Many immigration offices also have photo booths available.
          </p>
        </div>

        <div className="document-section">
          <h2>Processing Time</h2>
          <p>
            Photos are typically printed immediately. Digital versions may be available 
            for online applications.
          </p>
        </div>

        <div className="document-section">
          <h2>Important Notes</h2>
          <ul>
            <li>Ensure good lighting and clear focus</li>
            <li>Follow dress code guidelines</li>
            <li>Get multiple copies for different applications</li>
            <li>Keep digital copies for future use</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IdPhotoDocument;
