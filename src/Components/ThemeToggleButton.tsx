import React from "react";
import "../css/ThemeToggleButton.css"; // Ensure the path is correct

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
