import React, { useContext } from 'react';
import { ThemeContext } from './ThemeProvider';
import { useTheme } from '@mui/material/styles';
import { Button } from '@mui/material';        
import "../css/ThemeToggleButton.css"; 

/**
 * A button component that toggles the application's theme between light and dark modes.
 * Changing the colors of background, text and buttons in the application.
 *
 * @component
 * 
 * @returns {JSX.Element}
 * 
 * @example
 * <ThemeToggleButton toggleTheme={toggleTheme} />
 * 
 */
interface ThemeToggleButtonProps {
  toggleTheme: () => void;
}

const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ toggleTheme }) => {
  const { mode } = useContext(ThemeContext);
  return (
    <input
      type="checkbox"
      className="theme-checkbox"
      onChange={toggleTheme}
      checked={mode === "dark"}
    />
  );
};

export default ThemeToggleButton;
