// src/components/Header.tsx
import React from "react";
import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header = ({ title, subtitle }: HeaderProps) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box
      component="header"
      mb="30px"
      sx={{
        // you can also pull background from theme here:
        // bgcolor: "background.paper"
      }}
    >
      <Typography
        variant="h2"
        sx={{
          color:
            theme.palette.mode === "light"
              ? colors.primary[100]
              : colors.grey[100],
        }}
        fontWeight="bold"
        mb="5px"
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="h5" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};


export default Header;