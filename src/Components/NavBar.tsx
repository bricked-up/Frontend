import React, { useState } from "react";
import "../css/NavBar.css";
import HomeButton from "./HomeButton";
import LoginButton from "./LoginButton";
import ProfileButton from "./ProfileButton";
import ToggleColorButton from "./ThemeToggleButton";
import { useTheme } from '@mui/material/styles';

const NavBar: React.FC = () => {
  const theme = useTheme();

  const [bgColor, setBgColor] = useState("#ffffff");

  const toggleColor = () => {
    setBgColor(bgColor === "#ffffff" ? "#e0e0e0" : "#ffffff");
  };

  return (
    <nav className="navbar" style={{ backgroundColor: theme.palette.background.default }}>
      <div className="logo-container">
        <img src="../assets/logo.png" alt="Logo" className="logo" />
        <span className="company-name">Bricked Up</span>
      </div>
      <div className="actions">
        <HomeButton />
        <ToggleColorButton />
        <LoginButton />
        <ProfileButton />
      </div>
    </nav>
  );
};

export default NavBar;