import { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import "./languageButton.styles.css";

const LanguageButton = () => {
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (newLanguage: "en" | "ja" | "id") => {
    setLanguage(newLanguage);
    setShowLanguageOptions(false);
  };

  const languageOptions = [
    { code: "en", name: "English" },
    { code: "ja", name: "日本語" },
    { code: "id", name: "Indonesia" },
  ];

  return (
    <div className="global-language-toggle">
      <button
        className="global-language-button"
        onClick={() => setShowLanguageOptions(!showLanguageOptions)}
      >
        <span className="language-icon">🌐</span>
        {language === "en" ? "English" : language === "ja" ? "日本語" : "Indonesia"}
        <span className="language-arrow">▼</span>
      </button>

      {showLanguageOptions && (
        <div className="global-language-options">
          {languageOptions.map((option) => (
            <button
              key={option.code}
              className={`global-language-option ${
                language === option.code ? "active" : ""
              }`}
              onClick={() => handleLanguageChange(option.code as "en" | "ja" | "id")}
            >
              {option.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageButton;
