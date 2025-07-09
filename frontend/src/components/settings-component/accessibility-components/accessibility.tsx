import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import "./accessibility.styles.css";

interface AccessibilityProps {
  onBack: () => void;
}

const Accessibility: React.FC<AccessibilityProps> = ({ onBack }) => {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      id: "default",
      name: "Default",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      preview: "#667eea",
      description: "Classic purple gradient",
    },
    {
      id: "sunset",
      name: "Sunset",
      gradient: "linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)",
      preview: "#ff6b6b",
      description: "Warm orange to yellow",
    },
    {
      id: "forest",
      name: "Forest",
      gradient: "linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)",
      preview: "#56ab2f",
      description: "Fresh green gradient",
    },
    {
      id: "midnight",
      name: "Midnight",
      gradient: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
      preview: "#2c3e50",
      description: "Dark blue tones",
    },
    {
      id: "cherry",
      name: "Cherry",
      gradient: "linear-gradient(135deg, #eb3349 0%, #f45c43 100%)",
      preview: "#eb3349",
      description: "Vibrant red gradient",
    },
    {
      id: "ocean",
      name: "Ocean",
      gradient: "linear-gradient(135deg, #667db6 0%, #0082c8 100%)",
      preview: "#667db6",
      description: "Deep blue waters",
    },
    {
      id: "obsidian",
      name: "Obsidian",
      gradient: "linear-gradient(135deg, #374151 0%, #6b7280 100%)",
      preview: "#374151",
      description: "Dark obsidian tones",
    },
    {
      id: "golden",
      name: "Golden",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      preview: "#f093fb",
      description: "Pink to red gradient",
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
        <h1>Themes</h1>
      </div>

      <div className="accessibility-content">
        <div className="theme-intro">
          <h2>Choose Your Theme</h2>
          <p>Select a color theme that matches your style and preferences</p>
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
              aria-label={`Select ${themeOption.name} theme`}
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
