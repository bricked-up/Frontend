import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../utils/account.utils'; // Adjust path based on your directory structure
import { Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import "../../css/LoginButton.css";


const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {   
    logout();

    navigate('/');
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;