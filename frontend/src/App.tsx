import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./contexts/ProtectedRoute";
import Home from "./components/home-component/home";
import Locator from "./components/locator-component/locator";
import Settings from "./components/settings-component/settings";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import VisaForm from "./components/visa-form/VisaForm";
import AIFormAssistant from "./components/ai-form-assistant/AIFormAssistant";
import "./App.css";
import "./colors.css";

function App() {
  return (
    <ThemeProvider>
      <Router basename="">
        <AuthProvider>
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
              path="/visa-form"
              element={
                <ProtectedRoute>
                  <VisaForm onBack={() => window.history.back()} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-form-assistant"
              element={<AIFormAssistant onBack={() => window.history.back()} />}
            />
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
