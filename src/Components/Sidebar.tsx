import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { tokens } from "../theme";
import { useState } from "react";
import React from "react";


interface ItemProps {
  title: string;
  to: string;
  icon: React.ReactNode;
  selected: string;
  setSelected: (title: string) => void;
}

interface SidebarProps {
  isSidebar: boolean;
  setIsSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Item: React.FC<ItemProps> = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Link
      to={to}
      style={{
        textDecoration: "none",
        color: selected === title ? "#6870fa" : colors.grey[100],
      }}
      onClick={() => setSelected(title)}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "10px 20px",
          cursor: "pointer",
          "&:hover": { backgroundColor: colors.primary[400] },
        }}
      >
        {icon}
        <Typography sx={{ marginLeft: "15px" }}>{title}</Typography>
      </Box>
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isSidebar, setIsSidebar }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState<string>("Dashboard");

  return (
    <>
      <Box
        sx={{
          width: isSidebar ? "250px" : "0",
          overflowX: "hidden",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          backgroundColor: colors.primary[400],
          color: colors.grey[100],
          transition: "width 0.3s ease",
          zIndex: 1200,
        }}
      >
        <Box
          sx={{
            padding: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h5" sx={{ whiteSpace: "nowrap", overflow: "hidden" }}>
            {isSidebar && "Bricked Up"}
          </Typography>
          <IconButton onClick={() => setIsSidebar(false)} sx={{ color: colors.grey[100] }}>
            <MenuOutlinedIcon />
          </IconButton>
        </Box>

        {isSidebar && (
          <Box>
            <Item title="View Teams" to="/viewteam" icon={<PeopleOutlinedIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Create Team" to="/contacts" icon={<ContactsOutlinedIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Change Profile" to="/about_user" icon={<PersonOutlinedIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Activity" to="/activity" icon={<ReceiptOutlinedIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Calendar" to="/calendar" icon={<CalendarTodayOutlinedIcon />} selected={selected} setSelected={setSelected} />
            <Item title="FAQ Page" to="/faq" icon={<HelpOutlineOutlinedIcon />} selected={selected} setSelected={setSelected} />
          </Box>
        )}
      </Box>

      {/* Toggle button when collapsed */}
      {!isSidebar && (
        <IconButton
          onClick={() => setIsSidebar(true)}
          sx={{
            position: "fixed",
            top: 14,
            left: 10,
            backgroundColor: colors.primary[400],
            color: colors.grey[100],
            zIndex: 1300,
            "&:hover": { backgroundColor: colors.primary[300] },
          }}
        >
          <MenuOutlinedIcon />
        </IconButton>
      )}
    </>
  );
};

export default Sidebar;
