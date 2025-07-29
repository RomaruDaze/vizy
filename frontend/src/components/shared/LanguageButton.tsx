import { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import "./languageButton.styles.css";

const LanguageButton = () => {
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (newLanguage: "en" | "ja") => {
    setLanguage(newLanguage);
    setShowLanguageOptions(false);
  };

  return (
    <div className="global-language-toggle">
      <button
        className="global-language-button"
        onClick={() => setShowLanguageOptions(!showLanguageOptions)}
      >
        <span className="language-icon">🌐</span>
        {language === "en" ? "English" : "日本語"}
        <span className="language-arrow">▼</span>
      </button>

      {showLanguageOptions && (
        <div className="global-language-options">
          <button
            className={`global-language-option ${
              language === "en" ? "active" : ""
            }`}
            onClick={() => handleLanguageChange("en")}
          >
            English
          </button>
          <button
            className={`global-language-option ${
              language === "ja" ? "active" : ""
            }`}
            onClick={() => handleLanguageChange("ja")}
          >
            日本語
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageButton;
