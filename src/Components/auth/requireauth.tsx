import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CircularProgress, Box } from "@mui/material";

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get("/verify", { withCredentials: true });
        if (res.data.verified) {
          setIsVerified(true);
        } else {
          navigate("/login");
        }
      } catch (err) {
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    verifyUser();
  }, [navigate]);

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return isVerified ? <>{children}</> : null;
};

export default RequireAuth;
