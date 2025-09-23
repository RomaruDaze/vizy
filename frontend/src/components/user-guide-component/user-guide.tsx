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
  const [loading, setLoading] = useState(true);

  const onBack = () => {
    navigate("/settings");
  };

  const loadUserData = async () => {
    setLoading(true);
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

          if (targetType) {
            const userDocuments = generateDocuments(targetType);
            setDocuments(userDocuments);
          } else {
            console.log(
              "No target visa type found in profile, showing general documents"
            );
            // Show general documents when no specific visa type is found
            const generalDocuments = generateDocuments("General");
            setDocuments(generalDocuments);
          }
        } else {
          console.log("No profile found, showing general documents");
          // Show general documents when no profile is found
          const generalDocuments = generateDocuments("General");
          setDocuments(generalDocuments);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        // Show general documents on error
        const generalDocuments = generateDocuments("General");
        setDocuments(generalDocuments);
      }
    } else {
      // Show general documents when not logged in
      const generalDocuments = generateDocuments("General");
      setDocuments(generalDocuments);
    }
    setLoading(false);
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
    // Navigate to specific document page based on document name
    const documentName = document.name.toLowerCase();

    if (documentName.includes("passport")) {
      navigate("/passport-document");
    } else if (
      documentName.includes("application") ||
      documentName.includes("extension")
    ) {
      navigate("/application-document");
    } else if (
      documentName.includes("residence") ||
      documentName.includes("card")
    ) {
      navigate("/residence-card-document");
    } else if (documentName.includes("photo") || documentName.includes("id")) {
      navigate("/id-photo-document");
    } else if (
      documentName.includes("processing") ||
      documentName.includes("fee")
    ) {
      navigate("/processing-fee-document");
    } else if (
      documentName.includes("employment") ||
      documentName.includes("certificate")
    ) {
      navigate("/certificate-of-employment-document");
    } else if (
      documentName.includes("company") ||
      documentName.includes("registration")
    ) {
      navigate("/company-registration-document");
    } else if (
      documentName.includes("financial") ||
      documentName.includes("company")
    ) {
      navigate("/company-financial-document");
    } else if (
      documentName.includes("resident") ||
      documentName.includes("tax")
    ) {
      navigate("/resident-tax-document");
    } else if (
      documentName.includes("tax") ||
      documentName.includes("payment")
    ) {
      navigate("/tax-payment-document");
    } else if (
      documentName.includes("enrollment") ||
      documentName.includes("certificate")
    ) {
      navigate("/certificate-of-enrollment-document");
    } else if (
      documentName.includes("academic") ||
      documentName.includes("transcript")
    ) {
      navigate("/academic-transcript-document");
    } else if (
      documentName.includes("bank") ||
      documentName.includes("balance")
    ) {
      navigate("/bank-balance-document");
    } else if (
      documentName.includes("scholarship") ||
      documentName.includes("award")
    ) {
      navigate("/scholarship-award-document");
    } else if (
      documentName.includes("remittance") ||
      documentName.includes("certificate")
    ) {
      navigate("/certificate-of-remittance-document");
    } else if (
      documentName.includes("guarantee") ||
      documentName.includes("letter")
    ) {
      navigate("/letter-of-guarantee-document");
    } else if (
      documentName.includes("marriage") ||
      documentName.includes("certificate")
    ) {
      navigate("/marriage-certificate-document");
    } else if (
      documentName.includes("birth") ||
      documentName.includes("certificate")
    ) {
      navigate("/birth-certificate-document");
    } else if (
      documentName.includes("family") ||
      documentName.includes("passport")
    ) {
      navigate("/family-passport-document");
    } else {
      // For other documents, you can add more conditions here
      console.log("Document page not yet implemented for:", document.name);
    }
  };

  if (loading) {
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
          <div style={{ textAlign: "center", padding: "2rem", color: "white" }}>
            <div style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
              Loading documents...
            </div>
            <div style={{ fontSize: "0.9rem", opacity: 0.7 }}>
              Please wait while we load your personalized document list.
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        {documents.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "white" }}>
            <div style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
              No documents available
            </div>
            <div style={{ fontSize: "0.9rem", opacity: 0.7 }}>
              Please complete your profile setup to see personalized documents.
            </div>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default UserGuide;
