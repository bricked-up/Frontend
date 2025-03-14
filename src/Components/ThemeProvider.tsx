// src/CustomThemeProvider.tsx
import React, { createContext, useState, ReactNode, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { lightTheme, darkTheme } from "../utils/theme";

interface ThemeContextProps {
  mode: "light" | "dark";
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  mode: "light",
  toggleTheme: () => {},
});

export const CustomThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
   // Initialize mode from localStorage, defaulting to "light" if not found
   const [mode, setMode] = useState<"light" | "dark">(() => {
    const storedMode = localStorage.getItem("themeMode");
    return storedMode === "dark" ? "dark" : "light";
  });

  // Update localStorage whenever mode changes
  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  // This wraps the whole app around the theme provider and should in theory work
  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={mode === "light" ? lightTheme : darkTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
