import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  updateUserProfile,
  getUserProfile,
} from "../../services/userProfileService";

interface VisaStatusProps {
  answers: Record<string, any>;
}

interface DocumentItem {
  id: string;
  name: string;
  required: boolean;
  checked: boolean;
  category?: string;
  description?: string;
}

const VisaStatus = ({ answers }: VisaStatusProps) => {
  const { currentUser } = useAuth();
  const { t, language } = useLanguage();
  const [showReminderPopup, setShowReminderPopup] = useState(false);
  const [showDocumentsPopup, setShowDocumentsPopup] = useState(false);
  const [reminderTime, setReminderTime] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderSet, setReminderSet] = useState(false);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  // Document descriptions
  const documentDescriptions: Record<string, string> = {
    application:
      "Official form required by the Immigration Bureau for extending your stay in Japan. Must be filled out completely and accurately.",
    passport:
      "Your current passport with at least 6 months validity remaining. Must be the original document, not a copy.",
    residenceCard:
      "Your current residence card (在留カード) issued by the Immigration Bureau. Must be valid and not expired.",
    idPhoto:
      "Recent passport-style photo (4cm x 3cm) taken within the last 3 months. Must be clear and show your full face.",
    processingFee:
      "Payment for the visa extension application. Amount varies by visa type and processing time.",
    certificateOfEmployment:
      "Letter from your employer confirming your employment status, position, and salary. Must be on company letterhead.",
    companyRegistration:
      "Official document proving your company is registered and operating legally in Japan.",
    companyFinancial:
      "Financial statements showing your company's financial stability and ability to pay your salary.",
    residentTax:
      "Certificate showing you have paid your resident tax obligations for the previous year.",
    taxPayment:
      "Proof of income tax payments for the previous year. Usually obtained from your local tax office.",
    certificateOfEnrollment:
      "Letter from your school confirming your enrollment status and expected graduation date.",
    academicTranscript:
      "Official transcript showing your academic performance and attendance record.",
    bankBalance:
      "Certificate showing you have sufficient funds to support your studies and living expenses.",
    scholarshipAward:
      "Document confirming any scholarships or financial aid you are receiving.",
    certificateOfRemittance:
      "Proof of money transfers from your home country to support your studies.",
    letterOfGuarantee:
      "Letter from a guarantor (usually a parent or sponsor) promising financial support.",
    marriageCertificate:
      "Official marriage certificate translated into Japanese and authenticated by your embassy.",
    birthCertificate:
      "Official birth certificate for children, translated into Japanese and authenticated.",
    familyPassport:
      "Passport of the family member applying for the visa extension.",
    familyCertificateOfEmployment:
      "Employment certificate for the family member's sponsor.",
    familyResidentTax:
      "Resident tax certificate for the family member's sponsor.",
    familyTaxPayment:
      "Tax payment certificate for the family member's sponsor.",
    bankStatement:
      "Bank statements showing sufficient funds to support the family member.",
    familyLetterOfGuarantee:
      "Letter from the sponsor promising financial support for the family member.",
    familyRegister:
      "Official family register (戸籍) showing family relationships.",
    residentCertificate:
      "Certificate of residence (住民票) showing current address and family composition.",
  };

  // Generate documents based on visa type
  const generateDocuments = (visaType: string): DocumentItem[] => {
    const baseDocuments: DocumentItem[] = [
      {
        id: "application",
        name: "Application for Extension of Period of Stay",
        required: true,
        checked: false,
        category: "General",
        description: documentDescriptions.application,
      },
      {
        id: "passport",
        name: "Passport",
        required: true,
        checked: false,
        category: "General",
        description: documentDescriptions.passport,
      },
      {
        id: "residenceCard",
        name: "Residence Card",
        required: true,
        checked: false,
        category: "General",
        description: documentDescriptions.residenceCard,
      },
      {
        id: "idPhoto",
        name: "ID Photo",
        required: true,
        checked: false,
        category: "General",
        description: documentDescriptions.idPhoto,
      },
      {
        id: "processingFee",
        name: "Processing Fee",
        required: true,
        checked: false,
        category: "General",
        description: documentDescriptions.processingFee,
      },
    ];

    const workDocuments: DocumentItem[] = [
      {
        id: "certificateOfEmployment",
        name: "Certificate of Employment",
        required: true,
        checked: false,
        category: "Work Visa",
        description: documentDescriptions.certificateOfEmployment,
      },
      {
        id: "companyRegistration",
        name: "Company Registration Certificate",
        required: true,
        checked: false,
        category: "Work Visa",
        description: documentDescriptions.companyRegistration,
      },
      {
        id: "companyFinancial",
        name: "Company's Financial Documents",
        required: true,
        checked: false,
        category: "Work Visa",
        description: documentDescriptions.companyFinancial,
      },
      {
        id: "residentTax",
        name: "Resident Tax Certificate",
        required: true,
        checked: false,
        category: "Work Visa",
        description: documentDescriptions.residentTax,
      },
      {
        id: "taxPayment",
        name: "Tax Payment Certificate",
        required: true,
        checked: false,
        category: "Work Visa",
        description: documentDescriptions.taxPayment,
      },
    ];

    const studentDocuments: DocumentItem[] = [
      {
        id: "certificateOfEnrollment",
        name: "Certificate of Enrollment",
        required: true,
        checked: false,
        category: "Student Visa",
        description: documentDescriptions.certificateOfEnrollment,
      },
      {
        id: "academicTranscript",
        name: "Academic Transcript",
        required: true,
        checked: false,
        category: "Student Visa",
        description: documentDescriptions.academicTranscript,
      },
      {
        id: "bankBalance",
        name: "Bank Balance Certificate",
        required: true,
        checked: false,
        category: "Student Visa",
        description: documentDescriptions.bankBalance,
      },
      {
        id: "scholarshipAward",
        name: "Scholarship Award Certificate",
        required: true,
        checked: false,
        category: "Student Visa",
        description: documentDescriptions.scholarshipAward,
      },
      {
        id: "certificateOfRemittance",
        name: "Certificate of Remittance",
        required: true,
        checked: false,
        category: "Student Visa",
        description: documentDescriptions.certificateOfRemittance,
      },
      {
        id: "letterOfGuarantee",
        name: "Letter of Guarantee",
        required: true,
        checked: false,
        category: "Student Visa",
        description: documentDescriptions.letterOfGuarantee,
      },
    ];

    const familyDocuments: DocumentItem[] = [
      {
        id: "marriageCertificate",
        name: "Copy of Marriage Certificate (for spouses)",
        required: true,
        checked: false,
        category: "Family Visa",
        description: documentDescriptions.marriageCertificate,
      },
      {
        id: "birthCertificate",
        name: "Birth Certificate (for children)",
        required: true,
        checked: false,
        category: "Family Visa",
        description: documentDescriptions.birthCertificate,
      },
      {
        id: "familyPassport",
        name: "Passport",
        required: true,
        checked: false,
        category: "Family Visa",
        description: documentDescriptions.familyPassport,
      },
      {
        id: "familyCertificateOfEmployment",
        name: "Certificate of Employment",
        required: true,
        checked: false,
        category: "Family Visa",
        description: documentDescriptions.familyCertificateOfEmployment,
      },
      {
        id: "familyResidentTax",
        name: "Resident Tax Certificate",
        required: true,
        checked: false,
        category: "Family Visa",
        description: documentDescriptions.familyResidentTax,
      },
      {
        id: "familyTaxPayment",
        name: "Tax Payment Certificate",
        required: true,
        checked: false,
        category: "Family Visa",
        description: documentDescriptions.familyTaxPayment,
      },
      {
        id: "bankStatement",
        name: "Bank Statement",
        required: true,
        checked: false,
        category: "Family Visa",
        description: documentDescriptions.bankStatement,
      },
      {
        id: "familyLetterOfGuarantee",
        name: "Letter of Guarantee",
        required: true,
        checked: false,
        category: "Family Visa",
        description: documentDescriptions.familyLetterOfGuarantee,
      },
      {
        id: "familyRegister",
        name: "Family Register",
        required: true,
        checked: false,
        category: "Family Visa",
        description: documentDescriptions.familyRegister,
      },
      {
        id: "residentCertificate",
        name: "Resident Certificate",
        required: true,
        checked: false,
        category: "Family Visa",
        description: documentDescriptions.residentCertificate,
      },
    ];

    let allDocuments = [...baseDocuments];

    // Add specific documents based on visa type
    switch (visaType) {
      case "Work Visa":
        allDocuments = [...allDocuments, ...workDocuments];
        break;
      case "International Student Visa":
        allDocuments = [...allDocuments, ...studentDocuments];
        break;
      case "Family Visa":
        allDocuments = [...allDocuments, ...familyDocuments];
        break;
      case "Specified Skill Worker Visa":
        allDocuments = [...allDocuments, ...workDocuments];
        break;
      default:
        // For unknown visa types, show all documents
        allDocuments = [
          ...allDocuments,
          ...workDocuments,
          ...studentDocuments,
          ...familyDocuments,
        ];
    }

    return allDocuments;
  };

  // Load saved data from Firebase
  useEffect(() => {
    const loadSavedData = async () => {
      if (currentUser) {
        try {
          const profile = await getUserProfile(currentUser.uid);
          if (profile) {
            setReminderDate(profile.reminderDate || "");
            setReminderTime(profile.reminderTime || "");
            setReminderSet(profile.reminderSet || false);

            // Generate documents based on visa type
            const visaType = profile.visaType || "Work Visa";
            const generatedDocuments = generateDocuments(visaType);

            // Load document progress
            if (profile.documentProgress) {
              const updatedDocuments = generatedDocuments.map((doc) => ({
                ...doc,
                checked: profile.documentProgress![doc.id] || false,
              }));
              setDocuments(updatedDocuments);
            } else {
              setDocuments(generatedDocuments);
            }
          }
        } catch (error) {
          console.error("Error loading saved data:", error);
        }
      }
    };

    loadSavedData();
  }, [currentUser]);

  // Update documents when visa type changes
  useEffect(() => {
    if (answers.visaType) {
      const generatedDocuments = generateDocuments(answers.visaType);
      setDocuments(generatedDocuments);
    }
  }, [answers.visaType]);

  const getIncompleteCount = () => {
    return documents.filter((doc) => !doc.checked).length;
  };

  const handleDocumentToggle = (documentId: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId ? { ...doc, checked: !doc.checked } : doc
      )
    );
  };

  const handleDocumentsClick = () => {
    setShowDocumentsPopup(true);
  };

  const handleCloseDocumentsPopup = () => {
    setShowDocumentsPopup(false);
  };

  const handleSaveDocuments = async () => {
    if (currentUser) {
      const documentProgress: { [key: string]: boolean } = {};
      documents.forEach((doc) => {
        documentProgress[doc.id] = doc.checked;
      });

      await updateUserProfile(currentUser.uid, {
        documentProgress,
      });

      setShowDocumentsPopup(false);
    }
  };

  const getDeadlineStatus = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);

    if (deadlineDate < today) {
      return { status: "expired", message: t("deadline_expired") };
    } else if (deadlineDate <= threeMonthsFromNow) {
      return {
        status: "available",
        message: t("available_for_submission"),
      };
    } else {
      return {
        status: "not-available",
        message: t("not_available_for_submission"),
      };
    }
  };

  const deadlineStatus = answers.deadline
    ? getDeadlineStatus(answers.deadline)
    : null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return "https://img.icons8.com/ios-glyphs/100/FFFFFF/checked--v1.png";
      case "not-available":
        return "https://img.icons8.com/ios-filled/100/FFFFFF/clock--v1.png";
      case "expired":
        return "https://img.icons8.com/ios-filled/100/FFFFFF/warning-shield.png";
      default:
        return "";
    }
  };

  const handleReminderClick = () => {
    setShowReminderPopup(true);
  };

  const handleSetReminder = async () => {
    if (reminderDate && reminderTime && currentUser) {
      setReminderSet(true);
      setShowReminderPopup(false);

      // Save to Firebase
      await updateUserProfile(currentUser.uid, {
        reminderDate,
        reminderTime,
        reminderSet: true,
      });
    }
  };

  const handleClearReminder = async () => {
    if (currentUser) {
      setReminderSet(false);
      setReminderDate("");
      setReminderTime("");
      setShowReminderPopup(false);

      // Save to Firebase
      await updateUserProfile(currentUser.uid, {
        reminderDate: "",
        reminderTime: "",
        reminderSet: false,
      });
    }
  };

  const getReminderButtonText = () => {
    if (reminderSet) {
      return `Reminder set for ${reminderDate} at ${reminderTime}`;
    }
    return t("set_reminder");
  };

  const handleCloseReminderPopup = () => {
    setShowReminderPopup(false);
  };

  // Group documents by category
  const groupedDocuments = documents.reduce((groups, doc) => {
    const category = doc.category || "General";
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(doc);
    return groups;
  }, {} as Record<string, DocumentItem[]>);

  // Function to format date based on language
  const formatDate = (date: Date) => {
    if (language === "ja") {
      return date.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  return (
    <div className="visa-status-container">
      {/* Top Card - Deadline */}
      <div className="deadline-card">
        <div className="deadline-header">
          <img
            src="https://img.icons8.com/ios-filled/100/FFFFFF/overtime.png"
            alt="Deadline"
          />
          <h2>{t("your_residency_deadline")}</h2>
        </div>

        <div
          className={`deadline-availability ${deadlineStatus?.status || ""}`}
        >
          <div className="deadline-date">
            {answers.deadline
              ? formatDate(new Date(answers.deadline))
              : t("no_deadline_set")}
          </div>
          <div className="deadline-status">
            <p>{deadlineStatus?.message || t("no_deadline_set")}</p>
            {deadlineStatus && (
              <img
                src={getStatusIcon(deadlineStatus.status)}
                alt={deadlineStatus.status}
                className="status-icon"
              />
            )}
          </div>
        </div>
        <div className="deadline-reminder">
          <button
            className={`reminder-button ${reminderSet ? "reminder-set" : ""}`}
            onClick={handleReminderClick}
          >
            <img
              src="https://img.icons8.com/ios-filled/100/FFFFFF/bell.png"
              alt="Reminder"
              className="reminder-icon"
            />
            {getReminderButtonText()}
          </button>
        </div>
      </div>

      {/* Bottom Card - Incomplete Documents */}
      <div className="documents-card" onClick={handleDocumentsClick}>
        <div className="documents-content">
          <div className="documents-icon">
            <img
              src="https://img.icons8.com/ios-glyphs/100/FFFFFF/ingredients-list.png"
              alt="Documents"
            />
          </div>
          <div className="documents-text">
            <h3>{t("incomplete_documents")}</h3>
            <p>
              {getIncompleteCount()} {t("documents_remaining")}
            </p>
          </div>
          <div className="documents-arrow">→</div>
        </div>
      </div>

      {/* Documents Popup */}
      {showDocumentsPopup && (
        <div
          className="documents-popup-overlay"
          onClick={handleCloseDocumentsPopup}
        >
          <div
            className="documents-popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="documents-popup-header">
              <button
                className="close-button"
                onClick={handleCloseDocumentsPopup}
              >
                <img
                  src="https://img.icons8.com/sf-black-filled/100/FFFFFF/back.png"
                  alt="Back"
                />
              </button>
              <h3>{t("document_checklist")}</h3>
            </div>

            <div className="documents-list">
              {Object.entries(groupedDocuments).map(([category, docs]) => (
                <div key={category} className="document-category">
                  <h4 className="category-title">{category}</h4>
                  {docs.map((doc) => (
                    <div key={doc.id} className="document-item">
                      <label className="document-checkbox">
                        <input
                          type="checkbox"
                          checked={doc.checked}
                          onChange={() => handleDocumentToggle(doc.id)}
                        />
                        <span className="checkmark"></span>
                        <span className="document-name">{doc.name}</span>
                      </label>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="documents-actions">
              <button
                className="save-button-documents"
                onClick={handleSaveDocuments}
              >
                {t("save_changes")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reminder Popup */}
      {showReminderPopup && (
        <div
          className="reminder-popup-overlay"
          onClick={handleCloseReminderPopup}
        >
          <div
            className="reminder-popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="reminder-popup-header">
              <button
                className="close-button"
                onClick={handleCloseReminderPopup}
              >
                <img
                  src="https://img.icons8.com/sf-black-filled/100/FFFFFF/back.png"
                  alt="Back"
                />
              </button>
              <h3>{t("set_reminder")}</h3>
            </div>
            <div className="reminder-form">
              <div className="form-group">
                <label>{t("date")}</label>
                <input
                  type="date"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>{t("time")}</label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                />
              </div>
              <div className="reminder-actions">
                <button className="clear-button" onClick={handleClearReminder}>
                  {t("clear_reminder")}
                </button>
                <button
                  className="set-button"
                  onClick={handleSetReminder}
                  disabled={!reminderDate || !reminderTime}
                >
                  {t("set_reminder")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisaStatus;
