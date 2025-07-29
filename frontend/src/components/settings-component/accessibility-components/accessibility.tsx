import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import "./accessibility.styles.css";

interface AccessibilityProps {
  onBack: () => void;
}

const Accessibility: React.FC<AccessibilityProps> = ({ onBack }) => {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  const themes = [
    {
      id: "default",
      name: t("default"),
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      preview: "#667eea",
      description: t("classic_purple_gradient"),
    },
    {
      id: "sunset",
      name: t("sunset"),
      gradient: "linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)",
      preview: "#ff6b6b",
      description: t("warm_orange_yellow"),
    },
    {
      id: "forest",
      name: t("forest"),
      gradient: "linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)",
      preview: "#56ab2f",
      description: t("fresh_green_gradient"),
    },
    {
      id: "midnight",
      name: t("midnight"),
      gradient: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
      preview: "#2c3e50",
      description: t("dark_blue_tones"),
    },
    {
      id: "cherry",
      name: t("cherry"),
      gradient: "linear-gradient(135deg, #eb3349 0%, #f45c43 100%)",
      preview: "#eb3349",
      description: t("vibrant_red_gradient"),
    },
    {
      id: "ocean",
      name: t("ocean"),
      gradient: "linear-gradient(135deg, #667db6 0%, #0082c8 100%)",
      preview: "#667db6",
      description: t("deep_blue_waters"),
    },
    {
      id: "obsidian",
      name: t("obsidian"),
      gradient: "linear-gradient(135deg, #374151 0%, #6b7280 100%)",
      preview: "#374151",
      description: t("dark_obsidian_tones"),
    },
    {
      id: "golden",
      name: t("golden"),
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      preview: "#f093fb",
      description: t("pink_red_gradient"),
    },
  ];

  const handleThemeChange = (themeId: string) => {
    setTheme(themeId as any);
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
        <h1>{t("themes")}</h1>
      </div>

      <div className="accessibility-content">
        <div className="theme-intro">
          <h2>{t("choose_your_theme")}</h2>
          <p>{t("select_color_theme_matches_style")}</p>
        </div>

        <div className="theme-grid">
          {themes.map((themeOption) => (
            <button
              key={themeOption.id}
              className={`theme-button ${
                theme === themeOption.id ? "selected" : ""
              }`}
              onClick={() => handleThemeChange(themeOption.id)}
              style={{ background: themeOption.gradient }}
              aria-label={`${t("select")} ${themeOption.name} ${t("theme")}`}
            >
              <div className="theme-button-content">
                <div className="theme-name">{themeOption.name}</div>
                <div className="theme-description">
                  {themeOption.description}
                </div>

                {theme === themeOption.id && (
                  <div className="selected-indicator">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 12l2 2 4-4"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Accessibility;
