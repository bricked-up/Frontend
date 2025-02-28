import React, { useState } from "react";
import "./NavBar.css";
import HomeButton from "./HomeButton";
import LoginButton from "./LoginButton";
import ProfileButton from "./ProfileButton";
import ToggleColorButton from "./ToggleColorButton";

const NavBar: React.FC = () => {
  const [bgColor, setBgColor] = useState("#ffffff");

  const toggleColor = () => {
    setBgColor(bgColor === "#ffffff" ? "#e0e0e0" : "#ffffff");
  };

  return (
    <nav className="navbar" style={{ backgroundColor: bgColor }}>
      <div className="logo">Bricked Up</div>
      <div className="menu">
        <HomeButton />
      </div>
      <div className="actions">
        <LoginButton />
        <ProfileButton />
      </div>
      <ToggleColorButton toggleColor={toggleColor} />
    </nav>
  );
};

export default NavBar;
