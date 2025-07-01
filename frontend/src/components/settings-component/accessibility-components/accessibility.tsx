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
    },
    {
      id: "sunset",
      name: "Sunset",
      gradient: "linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)",
      preview: "#ff6b6b",
    },
    {
      id: "forest",
      name: "Forest",
      gradient: "linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)",
      preview: "#56ab2f",
    },
    {
      id: "midnight",
      name: "Midnight",
      gradient: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
      preview: "#2c3e50",
    },
    {
      id: "cherry",
      name: "Cherry",
      gradient: "linear-gradient(135deg, #eb3349 0%, #f45c43 100%)",
      preview: "#eb3349",
    },
  ];

  const handleThemeChange = (themeId: string) => {
    setTheme(themeId as any);
  };

  return (
    <div className="accessibility-page">
      <div className="accessibility-container">
        <div className="accessibility-header">
          <button className="back-button" onClick={onBack}>
            <img
              src="https://img.icons8.com/ios-filled/50/999999/chevron-left.png"
              alt="Back"
            />
          </button>
          <h1>Accessibility</h1>
        </div>

        <p>Choose your preferred theme color</p>

        <div className="theme-grid">
          {themes.map((themeOption) => (
            <div
              key={themeOption.id}
              className={`theme-option ${
                theme === themeOption.id ? "selected" : ""
              }`}
              onClick={() => handleThemeChange(themeOption.id)}
            >
              <div
                className="theme-preview"
                style={{ background: themeOption.gradient }}
              ></div>
              <div className="theme-info">
                <h3>{themeOption.name}</h3>
                <div
                  className="color-preview"
                  style={{ backgroundColor: themeOption.preview }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="accessibility-info">
          <h3>About Themes</h3>
          <p>
            Choose a theme that works best for your visual preferences. The
            selected theme will be applied across the entire app.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Accessibility;
