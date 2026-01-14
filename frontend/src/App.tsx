import { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import ProtectedRoute from "./contexts/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";
import "./colors.css";

// Eagerly loaded components (used on initial page load)
import Home from "./components/home-component/home";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import { InstallPrompt } from "./components/installPrompt-components/InstallPrompt";

// Lazy loaded components (code splitting for better performance)
const Locator = lazy(() => import("./components/locator-component/locator"));
const Settings = lazy(() => import("./components/settings-component/settings"));
const AIFormAssistant = lazy(
  () => import("./components/ai-form-assistant/ai")
);
const UserGuide = lazy(
  () => import("./components/user-guide-component/user-guide")
);
const Reminders = lazy(
  () => import("./components/reminders-component/reminders")
);

// Lazy loaded document components (large, rarely accessed)
const PassportDocument = lazy(
  () => import("./documents/documents-passport")
);
const ApplicationDocument = lazy(
  () => import("./documents/documents-application")
);
const ResidenceCardDocument = lazy(
  () => import("./documents/documents-residenceCard")
);
const IdPhotoDocument = lazy(() => import("./documents/documents-idPhoto"));
const ProcessingFeeDocument = lazy(
  () => import("./documents/documents-processingFee")
);
const CertificateOfEmploymentDocument = lazy(
  () => import("./documents/documents-certificateOfEmployment")
);
const CompanyRegistrationDocument = lazy(
  () => import("./documents/documents-companyRegistration")
);
const CompanyFinancialDocument = lazy(
  () => import("./documents/documents-companyFinancial")
);
const ResidentTaxDocument = lazy(
  () => import("./documents/documents-residentTax")
);
const TaxPaymentDocument = lazy(
  () => import("./documents/documents-taxPayment")
);
const CertificateOfEnrollmentDocument = lazy(
  () => import("./documents/documents-certificateOfEnrollment")
);
const AcademicTranscriptDocument = lazy(
  () => import("./documents/documents-academicTranscript")
);
const BankBalanceDocument = lazy(
  () => import("./documents/documents-bankBalance")
);
const ScholarshipAwardDocument = lazy(
  () => import("./documents/documents-scholarshipAward")
);
const CertificateOfRemittanceDocument = lazy(
  () => import("./documents/documents-certificateOfRemittance")
);
const LetterOfGuaranteeDocument = lazy(
  () => import("./documents/documents-letterOfGuarantee")
);
const MarriageCertificateDocument = lazy(
  () => import("./documents/documents-marriageCertificate")
);
const BirthCertificateDocument = lazy(
  () => import("./documents/documents-birthCertificate")
);
const FamilyPassportDocument = lazy(
  () => import("./documents/documents-familyPassport")
);

// Loading fallback component
const LoadingFallback = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
    }}
  >
    <div>Loading...</div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router basename="/vizy">
          <AuthProvider>
            <LanguageProvider>
              <Suspense fallback={<LoadingFallback />}>
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
                  <ProtectedRoute>
                    <AIFormAssistant onBack={() => window.history.back()} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reminders"
                element={
                  <ProtectedRoute>
                    <Reminders />
                  </ProtectedRoute>
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
              </Suspense>
              <InstallPrompt />
            </LanguageProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
