import React from "react";
import { useTheme } from "@mui/material/styles";
import NavBar from "../Components/Navbar/NavBar";

const ForgotPwd = () => {
  const theme = useTheme();

  return (
    <div
      style={{
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <NavBar />
      <section
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="msgFrame"
          style={{
            backgroundColor: theme.palette.primary.main,
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3 className="message" style={{ color: theme.palette.text.primary }}>
            Email sent for verification!
          </h3>
        </div>
      </section>
    </div>
  );
};

export default ForgotPwd;
