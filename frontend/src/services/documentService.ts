export interface DocumentItem {
  id: string;
  name: string;
  required: boolean;
  checked: boolean;
  category?: string;
  description?: string;
}

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
  familyTaxPayment: "Tax payment certificate for the family member's sponsor.",
  bankStatement:
    "Bank statements showing sufficient funds to support the family member.",
  familyLetterOfGuarantee:
    "Letter from the sponsor promising financial support for the family member.",
  familyRegister:
    "Official family register (戸籍) showing family relationships.",
  residentCertificate:
    "Certificate of residence (住民票) showing current address and family composition.",
};

export const generateDocuments = (visaType: string): DocumentItem[] => {
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

  // Fix the mapping to match your Firebase data exactly
  switch (visaType) {
    case "Work Residency":
    case "work_residency":
    case "Work Visa":
      allDocuments = [...allDocuments, ...workDocuments];
      break;
    case "International Student Residency":
    case "international_student_residency":
    case "Student Visa":
      allDocuments = [...allDocuments, ...studentDocuments];
      break;
    case "Family Residency":
    case "family_residency":
    case "Family Visa":
      allDocuments = [...allDocuments, ...familyDocuments];
      break;
    case "Specified Skill Worker Residency":
    case "specified_skill_worker_residency":
    case "Specified Skill Worker Visa":
      allDocuments = [...allDocuments, ...workDocuments];
      break;
    default:
      console.log("Unknown visa type:", visaType); // Debug
      allDocuments = [
        ...allDocuments,
        ...workDocuments,
        ...studentDocuments,
        ...familyDocuments,
      ];
  }

  return allDocuments;
};
