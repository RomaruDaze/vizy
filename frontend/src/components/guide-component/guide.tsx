import { useNavigate, useLocation } from "react-router-dom";
import * as Documents from "./documents";
import "./guide.styles.css";

interface LocationState {
  documentId?: string;
  documentName?: string;
  documentDescription?: string;
}

const Guide = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const handleBack = () => {
    navigate(-1);
  };

  const documentId = state?.documentId;

  // Convert document ID to component name
  const getComponentName = (id: string) => {
    return id.charAt(0).toUpperCase() + id.slice(1).replace(/([A-Z])/g, "$1");
  };

  const DocumentComponent = documentId
    ? Documents[getComponentName(documentId) as keyof typeof Documents]
    : null;

  return (
    <div className="guide-container">
      <div className="guide-header">
        <button className="back-button" onClick={handleBack}>
          <img
            src="https://img.icons8.com/ios-filled/100/FFFFFF/back.png"
            alt="Close"
          />
        </button>
        <h1>Guide</h1>
      </div>

      <div className="guide-content">
        {DocumentComponent ? (
          <DocumentComponent />
        ) : (
          <div className="placeholder-content">
            <div className="placeholder-icon">
              <img
                src="https://img.icons8.com/ios-filled/100/FFFFFF/help.png"
                alt="Guide"
              />
            </div>
            <h2>Document Guide</h2>
            <p>This page will contain document guides and help information.</p>
            <p>Coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Guide;
