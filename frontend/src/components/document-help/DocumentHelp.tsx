import { useState } from "react";
import "./document-help.styles.css";

interface DocumentHelpProps {
  documentId: string;
  onBack: () => void;
}

const DocumentHelp = ({ documentId, onBack }: DocumentHelpProps) => {
  const [currentDocument, setCurrentDocument] = useState(documentId);

  const documentInfo = {
    "application-extension": {
      title: "Application for Extension of Period of Stay",
      description:
        "The official application form required by the Immigration Bureau to extend your visa.",
      requirements: [
        "Must be filled out completely and accurately",
        "Should be submitted before your current visa expires",
        "Available at immigration offices or online",
        "Requires your signature and date",
      ],
      tips: [
        "Keep a copy of your application for your records",
        "Submit at least 3 months before expiration",
        "Make sure all information matches your passport",
      ],
    },
    passport: {
      title: "Passport",
      description: "Your valid passport with sufficient validity period.",
      requirements: [
        "Must be valid for the entire period of your stay",
        "Should have at least 2 blank pages",
        "Must be in good condition",
        "Should be the same passport used for your original visa",
      ],
      tips: [
        "Check expiration date before applying",
        "Make copies of all pages",
        "Keep your passport in a safe place",
      ],
    },
    "residence-card": {
      title: "Residence Card",
      description:
        "Your current residence card (在留カード) issued by the Japanese government.",
      requirements: [
        "Must be current and valid",
        "Should not be expired",
        "Must be in good condition",
        "Should match your current address",
      ],
      tips: [
        "Update your address within 14 days of moving",
        "Carry it with you at all times",
        "Report any changes to immigration",
      ],
    },
    "id-photo": {
      title: "ID Photo",
      description:
        "Recent passport-style photograph meeting Japanese immigration standards.",
      requirements: [
        "Taken within the last 3 months",
        "4cm x 3cm size",
        "Plain white background",
        "No glasses or head coverings",
        "Neutral facial expression",
      ],
      tips: [
        "Use a professional photo service",
        "Ensure good lighting and clarity",
        "Follow Japanese photo standards exactly",
      ],
    },
    "processing-fee": {
      title: "Processing Fee",
      description: "The required fee for visa extension processing.",
      requirements: [
        "Must be paid in Japanese yen",
        "Amount varies by visa type and duration",
        "Payment methods vary by office",
        "Receipt must be kept",
      ],
      tips: [
        "Check current fees before applying",
        "Bring exact change if paying in cash",
        "Keep payment receipt safe",
      ],
    },
    "certificate-employment": {
      title: "Certificate of Employment",
      description:
        "Official document from your employer confirming your employment status.",
      requirements: [
        "Must be on company letterhead",
        "Should include your position and salary",
        "Must be signed by authorized person",
        "Should be recent (within 3 months)",
      ],
      tips: [
        "Request this document well in advance",
        "Ensure it includes all required information",
        "Keep original and copies",
      ],
    },
    "company-registration": {
      title: "Company Registration Certificate",
      description:
        "Official document proving your employer's business registration.",
      requirements: [
        "Must be current and valid",
        "Should show company's legal status",
        "Must be from official government source",
        "Should include company details",
      ],
      tips: [
        "Your employer should provide this",
        "Check that it's the most recent version",
        "Verify company information matches",
      ],
    },
    "financial-documents": {
      title: "Company's Financial Documents",
      description:
        "Financial statements showing your employer's financial stability.",
      requirements: [
        "Recent financial statements",
        "Should show company profitability",
        "Must be official documents",
        "Should be from current fiscal year",
      ],
      tips: [
        "Your employer handles this requirement",
        "Ensure documents are up-to-date",
        "Check financial health of company",
      ],
    },
    "resident-tax-certificate": {
      title: "Resident Tax Certificate",
      description: "Certificate showing your resident tax payment status.",
      requirements: [
        "Must be from your local city hall",
        "Should show current tax year",
        "Must include your name and address",
        "Should show payment status",
      ],
      tips: [
        "Apply at your local city hall",
        "Bring your residence card",
        "Request multiple copies if needed",
      ],
    },
    "tax-payment-certificate": {
      title: "Tax Payment Certificate",
      description: "Certificate showing your income tax payment status.",
      requirements: [
        "Must be from tax office",
        "Should show current tax year",
        "Must include your income details",
        "Should show payment status",
      ],
      tips: [
        "Apply at your local tax office",
        "Bring your residence card and passport",
        "Request multiple copies if needed",
      ],
    },
    "certificate-enrollment": {
      title: "Certificate of Enrollment",
      description:
        "Official document from your school confirming your enrollment status.",
      requirements: [
        "Must be on school letterhead",
        "Should include your course details",
        "Must be signed by school official",
        "Should be recent (within 3 months)",
      ],
      tips: [
        "Request this document well in advance",
        "Ensure it includes all required information",
        "Keep original and copies",
      ],
    },
    "academic-transcript": {
      title: "Academic Transcript",
      description:
        "Official record of your academic performance and courses taken.",
      requirements: [
        "Must be official transcript",
        "Should show current academic status",
        "Must be from your school",
        "Should include GPA and credits",
      ],
      tips: [
        "Request this document well in advance",
        "Ensure it's the official version",
        "Check that all courses are listed",
      ],
    },
    "bank-balance": {
      title: "Bank Balance Certificate",
      description:
        "Official document from your bank showing your account balance.",
      requirements: [
        "Must be from your bank",
        "Should show current balance",
        "Must be recent (within 1 month)",
        "Should be in Japanese yen",
      ],
      tips: [
        "Request this document from your bank",
        "Ensure sufficient funds are shown",
        "Keep original and copies",
      ],
    },
    "scholarship-certificate": {
      title: "Scholarship Award Certificate",
      description: "Document confirming your scholarship status and amount.",
      requirements: [
        "Must be from scholarship provider",
        "Should show scholarship amount",
        "Must be current and valid",
        "Should include duration",
      ],
      tips: [
        "Request this document well in advance",
        "Ensure it shows all scholarship details",
        "Keep original and copies",
      ],
    },
    "remittance-certificate": {
      title: "Certificate of Remittance",
      description: "Document showing money transfers from your home country.",
      requirements: [
        "Must be from your bank",
        "Should show transfer amounts",
        "Must be recent transfers",
        "Should include sender details",
      ],
      tips: [
        "Keep records of all transfers",
        "Ensure transfers are regular",
        "Maintain sufficient funds",
      ],
    },
    "letter-guarantee": {
      title: "Letter of Guarantee",
      description: "Document from a guarantor promising financial support.",
      requirements: [
        "Must be from Japanese resident",
        "Should include guarantor details",
        "Must be signed and sealed",
        "Should include financial commitment",
      ],
      tips: [
        "Choose a reliable guarantor",
        "Ensure guarantor understands responsibilities",
        "Keep original and copies",
      ],
    },
    "marriage-certificate": {
      title: "Marriage Certificate",
      description: "Official document proving your marriage status.",
      requirements: [
        "Must be official certificate",
        "Should be translated to Japanese",
        "Must be apostilled if required",
        "Should be recent",
      ],
      tips: [
        "Get official translation if needed",
        "Check if apostille is required",
        "Keep original and copies",
      ],
    },
    "birth-certificate": {
      title: "Birth Certificate",
      description: "Official document proving the birth of your child.",
      requirements: [
        "Must be official certificate",
        "Should be translated to Japanese",
        "Must be apostilled if required",
        "Should be recent",
      ],
      tips: [
        "Get official translation if needed",
        "Check if apostille is required",
        "Keep original and copies",
      ],
    },
    "family-register": {
      title: "Family Register",
      description:
        "Official family registration document from your home country.",
      requirements: [
        "Must be official document",
        "Should be translated to Japanese",
        "Must be apostilled if required",
        "Should be recent",
      ],
      tips: [
        "Get official translation if needed",
        "Check if apostille is required",
        "Keep original and copies",
      ],
    },
    "resident-certificate": {
      title: "Resident Certificate",
      description: "Certificate showing your residence status in Japan.",
      requirements: [
        "Must be from your local city hall",
        "Should show current address",
        "Must be recent (within 3 months)",
        "Should include family members",
      ],
      tips: [
        "Apply at your local city hall",
        "Bring your residence card",
        "Update when you move",
      ],
    },
  };

  const document = documentInfo[currentDocument as keyof typeof documentInfo];

  if (!document) {
    return (
      <div className="document-help-container">
        <div className="document-help-header">
          <button className="back-button" onClick={onBack}>
            ← Back
          </button>
          <h1>Document Not Found</h1>
        </div>
        <div className="document-help-content">
          <p>This document information is not available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="document-help-container">
      <div className="document-help-header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <h1>{document.title}</h1>
      </div>

      <div className="document-help-content">
        <div className="document-section">
          <h2>Description</h2>
          <p>{document.description}</p>
        </div>

        <div className="document-section">
          <h2>Requirements</h2>
          <ul>
            {document.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>

        <div className="document-section">
          <h2>Tips</h2>
          <ul>
            {document.tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DocumentHelp;
