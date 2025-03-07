import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    localStorage.getItem("isDarkMode") === "true"
  );

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("isDarkMode", newMode.toString());
      return newMode;
    });
  };

  // Automatically apply the `dark` class to the <body>
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <div className={isDarkMode ? "dark" : ""}>{children}</div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
