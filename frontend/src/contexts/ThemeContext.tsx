import React, { createContext, useContext, useState, useEffect } from "react";

type ThemeMode = "default" | "sunset" | "forest" | "midnight" | "cherry";

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>("default");

  // Theme gradients mapping
  const themeGradients = {
    default: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    sunset: "linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)",
    forest: "linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)",
    midnight: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
    cherry: "linear-gradient(135deg, #eb3349 0%, #f45c43 100%)",
  };

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("vizy-theme") as ThemeMode;
    if (savedTheme && themeGradients[savedTheme]) {
      setTheme(savedTheme);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    const gradient = themeGradients[theme];
    if (gradient) {
      document.documentElement.style.setProperty("--master-gradient", gradient);
      localStorage.setItem("vizy-theme", theme);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
