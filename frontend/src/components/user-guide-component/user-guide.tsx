import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getUserProfile } from "../../services/userProfileService";
import {
  generateDocuments,
  type DocumentItem,
} from "../../services/documentService";
import "./user-guide.styles.css";

const UserGuide = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [targetVisaType, setTargetVisaType] = useState("Work Visa");

  const onBack = () => {
    navigate(-1);
  };

  const loadUserData = async () => {
    if (currentUser) {
      try {
        const profile = await getUserProfile(currentUser.uid);
        if (profile) {
          // Determine target visa type based on purpose
          let targetType = null;

          if (profile.purpose === "Extend current residency") {
            targetType = profile.ResidencyType;
          } else if (
            profile.purpose === "Change to a different Residency type"
          ) {
            targetType = profile.purpose_target;
          }

          console.log("Profile:", profile);
          console.log("Target type:", targetType);

          if (targetType) {
            setTargetVisaType(targetType);
            const userDocuments = generateDocuments(targetType);
            setDocuments(userDocuments);
          } else {
            console.error("No target visa type found in profile");
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    }
  };

  useEffect(() => {
    loadUserData();
  }, [currentUser]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadUserData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [currentUser]);

  const groupedDocuments = documents.reduce((groups, doc) => {
    const category = doc.category || "General";
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(doc);
    return groups;
  }, {} as Record<string, DocumentItem[]>);

  const handleDocumentClick = (document: DocumentItem) => {
    console.log("Clicked document:", document.name);
  };

  return (
    <div className="settings-container-page">
      <div className="settings-header">
        <button className="back-button" onClick={onBack}>
          <img
            src="https://img.icons8.com/sf-black-filled/100/FFFFFF/back.png"
            alt="Back"
          />
        </button>
        <h1>User Guide</h1>
      </div>

      <div className="user-guide-content">
        <h2>Required Documents for {targetVisaType}</h2>

        <div className="documents-section">
          {Object.entries(groupedDocuments).map(([category, docs]) => (
            <div key={category} className="document-category">
              <h3 className="category-title">{category}</h3>
              <div className="document-cards">
                {docs.map((doc) => (
                  <div
                    key={doc.id}
                    className="document-card"
                    onClick={() => handleDocumentClick(doc)}
                  >
                    <div className="document-icon">
                      <img
                        src="https://img.icons8.com/ios-glyphs/100/FFFFFF/document.png"
                        alt="Document"
                      />
                    </div>
                    <div className="document-content">
                      <h4>{doc.name}</h4>
                      <p>{doc.description}</p>
                    </div>
                    <div className="document-status">
                      <span className="required-badge">Required</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserGuide;
