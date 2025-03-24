import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

interface HeaderProps {
  title: string;
  subtitle: string;
}

/**
 * Header Component
 *
 * Displays a title and subtitle for a page or section.
 *
 * @component
 * @example
 *
 * @param {HeaderProps} props - The component props.
 * @param {string} props.title - The main title text.
 * @param {string} props.subtitle - The subtitle text.
 *
 * @returns {JSX.Element} The Header component.
 */

const Header = ({ title, subtitle }: HeaderProps) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box mb="30px">
      <Typography
        variant="h2"
        color={colors.grey[100]}
        fontWeight="bold"
        sx={{ m: "0 0 5px 0" }}
      >
        {title}
      </Typography>
      <Typography variant="h5" color={colors.greenAccent[400]}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
