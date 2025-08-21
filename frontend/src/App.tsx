import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import ProtectedRoute from "./contexts/ProtectedRoute";
import Home from "./components/home-component/home";
import Locator from "./components/locator-component/locator";
import Settings from "./components/settings-component/settings";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import AIFormAssistant from "./components/ai-form-assistant/ai";
import UserGuide from "./components/user-guide-component/user-guide";
import { InstallPrompt } from "./components/installPrompt-components/InstallPrompt";
import "./App.css";
import "./colors.css";
import PassportDocument from "./documents/documents-passport";
import ApplicationDocument from "./documents/documents-application";
import ResidenceCardDocument from "./documents/documents-residenceCard";
import IdPhotoDocument from "./documents/documents-idPhoto";
import ProcessingFeeDocument from "./documents/documents-processingFee";
import CertificateOfEmploymentDocument from "./documents/documents-certificateOfEmployment";
import CompanyRegistrationDocument from "./documents/documents-companyRegistration";
import CompanyFinancialDocument from "./documents/documents-companyFinancial";
import ResidentTaxDocument from "./documents/documents-residentTax";
import TaxPaymentDocument from "./documents/documents-taxPayment";
import CertificateOfEnrollmentDocument from "./documents/documents-certificateOfEnrollment";
import AcademicTranscriptDocument from "./documents/documents-academicTranscript";
import BankBalanceDocument from "./documents/documents-bankBalance";
import ScholarshipAwardDocument from "./documents/documents-scholarshipAward";
import CertificateOfRemittanceDocument from "./documents/documents-certificateOfRemittance";
import LetterOfGuaranteeDocument from "./documents/documents-letterOfGuarantee";
import MarriageCertificateDocument from "./documents/documents-marriageCertificate";
import BirthCertificateDocument from "./documents/documents-birthCertificate";
import FamilyPassportDocument from "./documents/documents-familyPassport";

function App() {
  return (
    <ThemeProvider>
      <Router basename="">
        <AuthProvider>
          <LanguageProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/locator"
                element={
                  <ProtectedRoute>
                    <Locator />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai-form-assistant"
                element={
                  <AIFormAssistant onBack={() => window.history.back()} />
                }
              />
              <Route
                path="/user-guide"
                element={
                  <ProtectedRoute>
                    <UserGuide />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/passport-document"
                element={
                  <ProtectedRoute>
                    <PassportDocument />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/application-document"
                element={
                  <ProtectedRoute>
                    <ApplicationDocument />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/residence-card-document"
                element={
                  <ProtectedRoute>
                    <ResidenceCardDocument />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/id-photo-document"
                element={
                  <ProtectedRoute>
                    <IdPhotoDocument />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/processing-fee-document"
                element={
                  <ProtectedRoute>
                    <ProcessingFeeDocument />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/certificate-of-employment-document"
                element={
                  <ProtectedRoute>
                    <CertificateOfEmploymentDocument />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/company-registration-document"
                element={
                  <ProtectedRoute>
                    <CompanyRegistrationDocument />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/company-financial-document"
                element={
                  <ProtectedRoute>
                    <CompanyFinancialDocument />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resident-tax-document"
                element={
                  <ProtectedRoute>
                    <ResidentTaxDocument />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tax-payment-document"
                element={
                  <ProtectedRoute>
                    <TaxPaymentDocument />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/certificate-of-enrollment-document"
                element={
                  <ProtectedRoute>
                    <CertificateOfEnrollmentDocument />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/academic-transcript-document"
                element={
                  <ProtectedRoute>
                    <AcademicTranscriptDocument />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bank-balance-document"
                element={
                  <ProtectedRoute>
                    <BankBalanceDocument />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/scholarship-award-document"
                element={
                  <ProtectedRoute>
                    <ScholarshipAwardDocument />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/certificate-of-remittance-document"
                element={
                  <ProtectedRoute>
                    <CertificateOfRemittanceDocument />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/letter-of-guarantee-document"
                element={
                  <ProtectedRoute>
                    <LetterOfGuaranteeDocument />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/marriage-certificate-document"
                element={
                  <ProtectedRoute>
                    <MarriageCertificateDocument />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/birth-certificate-document"
                element={
                  <ProtectedRoute>
                    <BirthCertificateDocument />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/family-passport-document"
                element={
                  <ProtectedRoute>
                    <FamilyPassportDocument />
                  </ProtectedRoute>
                }
              />
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
            <InstallPrompt />
          </LanguageProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
