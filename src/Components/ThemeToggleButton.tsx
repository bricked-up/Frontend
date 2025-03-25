import React, { useContext } from 'react';
import { ColorModeContext } from '../theme'; // Use the new context from your theme file
import { useTheme } from '@mui/material/styles';
import "../css/ThemeToggleButton.css";

/**
 * A toggle switch component that toggles the application's theme between light and dark modes.
 * Changing the colors of background, text, and buttons throughout the application.
 *
 * @component
 * @example
 * <ThemeToggleButton />
 *
 * @returns {JSX.Element} The rendered theme toggle switch.
 */
const ThemeToggleButton: React.FC = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext); // Access the new color mode context

  return (
    <input
      type="checkbox"
      className="theme-checkbox"
      onChange={colorMode.toggleColorMode}  // Use the toggleColorMode function from the new context
      checked={theme.palette.mode === "dark"} // Determine checked state based on the theme mode
    />
  );
};

export default ThemeToggleButton;