import React from "react";
import { Button } from "@mui/material";
import "../../css/HomeButton.css";
import { useNavigate } from "react-router-dom";

/**
 * A button component that navigates the user to the home page.
 *
 * @component
 * @returns {JSX.Element} 
 * @example
 * <HomeButton />
 */
const HomeButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="contained"
      size="large"
      onClick={() => navigate("/")}
      sx={{
        px: 2,
        py: 1,
        borderRadius: 2,
        fontWeight: "bold",
        textTransform: "none",
        background: "linear-gradient(to right, #0ea5e9, #6366f1)",
        color: "#fff",
        boxShadow: "0 8px 20px rgba(6, 182, 212, 0.4)",
        filter: "drop-shadow(0 0 0.75rem rgba(99, 102, 241, 0.5))",
        '&:hover': {
          background: "linear-gradient(to right, #6366f1, #0ea5e9)"
        }
      }}
    >
      Home
    </Button>
  );
};

export default HomeButton;
