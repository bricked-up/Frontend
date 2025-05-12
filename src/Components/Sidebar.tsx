import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AddTaskIcon from "@mui/icons-material/AddTask";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import AddCircleIcon from '@mui/icons-material/AddCircle';
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
const userid = localStorage.getItem("userid");
const Item: React.FC<ItemProps> = ({
  title,
  to,
  icon,
  selected,
  setSelected,
}) => {
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
          backgroundColor:
            theme.palette.mode === "light"
              ? colors.primary[900]
              : colors.primary[400],
          color: colors.grey[100],
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
  const navigate = useNavigate();

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
          backgroundColor:
            theme.palette.mode === "light"
              ? colors.primary[900]
              : colors.primary[400],
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
          <Typography
            variant="h5"
            sx={{ whiteSpace: "nowrap", overflow: "hidden" }}
          />
          <Typography
            variant="h5"
            sx={{ whiteSpace: "nowrap", overflow: "hidden" }}
          >
            {isSidebar && "Bricked Up"}
          </Typography>
          <IconButton
            onClick={() => setIsSidebar(false)}
            sx={{ color: colors.grey[100] }}
          />
          <IconButton
            onClick={() => setIsSidebar(false)}
            sx={{ color: colors.grey[100] }}
          >
            <MenuOutlinedIcon />
          </IconButton>
        </Box>

        {isSidebar && (
          <Box>
            <Item
              title="Create Organization"
              to="/createorg"
              icon={<AddCircleIcon/>}
              selected={selected}
              setSelected={setSelected}
              />
            <Item
              title="View Organizations"
              to="/viewOrg"
              icon={<CorporateFareIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Create Issue"
              to="/createIssue"
              icon={<AddTaskIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="View Projects"
              to="/viewProject"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Create Projects"
              to="/contacts"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="View Your Profile"
              to={`/user/${userid}/aboutUser`}
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Activity"
              to="/activity"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Calendar"
              to="/calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="FAQ Page"
              to="/faq"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
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
