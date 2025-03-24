// src/CustomThemeProvider.tsx
import React, { ReactNode } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useMode, ColorModeContext } from "../utils/theme";

export const CustomThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // useMode returns the current theme and the color mode toggle function
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
