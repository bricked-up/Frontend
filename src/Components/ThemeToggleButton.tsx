// src/ThemeToggleButton.tsx
import React, { useContext } from 'react';
import { ThemeContext } from './ThemeProvider';
import { useTheme } from '@mui/material/styles';
import { Button } from '@mui/material';
        
import "../css/ThemeToggleButton.css"; 

interface ThemeToggleButtonProps {
  toggleTheme: () => void;
}

const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ toggleTheme }) => {
  const { mode } = useContext(ThemeContext);
  return (
    <div className="toggle-switch">
      <input 
        type="checkbox" 
        id="toggle-switch" 
        onChange={toggleTheme} 
        checked={mode === "dark"} 
      />
      <label htmlFor="toggle-switch"></label>
    </div>
  );
};

export default ThemeToggleButton;
