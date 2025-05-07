import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme";

type DropDownProps = {
  value: string;
  onSelect: (value: string) => void;
};

const DropDown = ({ value, onSelect }: DropDownProps) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleChange = (event: SelectChangeEvent) => {
    onSelect(event.target.value);
  };

  return (
    <FormControl
      size="small"
      sx={{
        width: 200,
        bgcolor:
          theme.palette.mode === "light"
            ? colors.primary[900]
            : colors.primary[400],
        borderRadius: 1,
      }}
    >
      <Select
        value={value}
        onChange={handleChange}
        displayEmpty
        size="small"
        renderValue={(selected) => {
          if (!selected) {
            return <span style={{ color: "#aaa" }}>Select Organization</span>;
          }
          return selected;
        }}
        sx={{
          backgroundColor:
            theme.palette.mode === "light"
              ? colors.primary[900]
              : colors.primary[400],
          color: "#fff",
          "& .MuiSelect-select": {
            paddingY: 1,
            paddingX: 2,
          },
          "& .MuiSelect-icon": {
            color: "#fff",
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor:
                theme.palette.mode === "light"
                  ? colors.primary[900]
                  : colors.primary[400],
              color: "#fff",
              borderRadius: 2,
              mt: 1,
              "& .MuiMenuItem-root": {
                paddingY: 1,
                paddingX: 2,
                fontSize: "0.9rem",
                minHeight: "36px",
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "light"
                      ? colors.primary[800]
                      : colors.primary[300],
                },
              },
            },
          },
        }}
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="Bricked-Up">Bricked-Up</MenuItem>
        <MenuItem value="George King IT">George King IT</MenuItem>
        <MenuItem value="SAP">SAP</MenuItem>
      </Select>
    </FormControl>
  );
};

export default DropDown;
