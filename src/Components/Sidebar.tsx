import { JSX, useEffect } from "react";
import { useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Drawer,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link } from "react-router-dom";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { tokens } from "../theme";

interface ItemProps {
  title: string;
  to: string;
  icon: JSX.Element;
  selected: string;
  setSelected: (title: string) => void;
}

interface SidebarProps {
  isSidebar: boolean;
  setIsSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Sidebar Menu Item Component
 */
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
        }}
      >
        {icon}
        <Typography sx={{ marginLeft: "15px" }}>{title}</Typography>
      </Box>
    </Link>
  );
};

/**
 * Sidebar Component
 */
const Sidebar: React.FC<SidebarProps> = ({ isSidebar, setIsSidebar }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState<string>("Dashboard");

  // Set body margin dynamically like in HTML example
  useEffect(() => {
    const main = document.getElementById("main");
    if (main) {
      main.style.transition = "margin-left 0.5s";
      main.style.marginLeft = isSidebar ? "250px" : "0";
    }
  }, [isSidebar]);

  return (
    <>
      <Drawer
        open={isSidebar}
        variant="persistent"
        sx={{
          width: isSidebar ? 250 : 0,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 250,
            backgroundColor: colors.primary[400],
            color: colors.grey[100],
            transition: "width 0.5s ease",
            overflowX: "hidden",
          },
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
          <Typography variant="h5" color={colors.grey[100]}>
            Bricked Up
          </Typography>
          <IconButton onClick={() => setIsSidebar(false)}>
            <MenuOutlinedIcon />
          </IconButton>
        </Box>

        <Box>
          <Item
            title="View Teams"
            to="/viewteam"
            icon={<PeopleOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Create Team"
            to="/contacts"
            icon={<ContactsOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Change Profile"
            to="/about_user"
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
      </Drawer>

      {/* Toggle button */}
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
