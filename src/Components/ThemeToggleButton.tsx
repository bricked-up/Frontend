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
  return (
    <div className="toggle-switch">
      <input 
        type="checkbox" 
        id="toggle-switch" 
        onChange={toggleTheme} 
      />
      <label htmlFor="toggle-switch"></label>
    </div>
  );

};

export default ThemeToggleButton;
