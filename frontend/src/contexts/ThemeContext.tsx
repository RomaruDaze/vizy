import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

type ThemeMode =
  | "ocean"
  | "sunset"
  | "forest"
  | "midnight"
  | "cherry"
  | "purple"
  | "obsidian"
  | "golden";

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

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<ThemeMode>("ocean");

  // Theme gradients mapping with primary colors
  const themeConfig = {
    sunset: {
      gradient: "linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)",
      primary: "#ff6b6b",
      hover: "linear-gradient(135deg, #e55a5a 0%, #e6b94a 100%)",
    },
    forest: {
      gradient: "linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)",
      primary: "#56ab2f",
      hover: "linear-gradient(135deg, #4a9a1f 0%, #97d5b8 100%)",
    },
    midnight: {
      gradient: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
      primary: "#2c3e50",
      hover: "linear-gradient(135deg, #1e2b3a 0%, #2a3a4a 100%)",
    },
    cherry: {
      gradient: "linear-gradient(135deg, #eb3349 0%, #f45c43 100%)",
      primary: "#eb3349",
      hover: "linear-gradient(135deg, #d42a3f 0%, #e24a33 100%)",
    },
    ocean: {
      gradient: "linear-gradient(135deg, #667db6 0%, #0082c8 100%)",
      primary: "#667db6",
      hover: "linear-gradient(135deg, #5a6da4 0%, #0071b0 100%)",
    },
    obsidian: {
      gradient: "linear-gradient(135deg, #374151 0%, #6b7280 100%)",
      primary: "#374151",
      hover: "linear-gradient(135deg, #2a303c 0%, #555e6c 100%)",
    },
    golden: {
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      primary: "#f093fb",
      hover: "linear-gradient(135deg, #e082ea 0%, #e4465c 100%)",
    },
    purple: {
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      primary: "#667eea",
      hover: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
    },
  };

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("vizy-theme") as ThemeMode;
    if (savedTheme && themeConfig[savedTheme]) {
      setTheme(savedTheme);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    const config = themeConfig[theme];
    if (config) {
      // Apply CSS custom properties
      document.documentElement.style.setProperty(
        "--master-gradient",
        config.gradient
      );
      document.documentElement.style.setProperty(
        "--color-primary-solid",
        config.primary
      );
      document.documentElement.style.setProperty(
        "--button-hover",
        config.hover
      );

      // Save to localStorage
      localStorage.setItem("vizy-theme", theme);
    }
  }, [theme]);

  const setThemeMemoized = useCallback((newTheme: ThemeMode) => {
    setTheme(newTheme);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme: setThemeMemoized,
    }),
    [theme, setThemeMemoized]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
