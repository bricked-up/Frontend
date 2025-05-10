import React from "react";
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  InputLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme";

type DropDownProps = {
  value: string;
  onSelect: (value: string) => void;
  options: string[];
  label?: string;
};

const DropDown = ({ value, onSelect, options, label }: DropDownProps) => {
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
      {label && <InputLabel id="dropdown-label">{label}</InputLabel>}
      <Select
        labelId="dropdown-label"
        id="dropdown"
        value={value}
        onChange={handleChange}
        label={label}
        size="medium"
        displayEmpty
        renderValue={(selected) => {
          if (!selected) {
            return <span style={{ color: "#aaa" }}>Select</span>;
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
              width: 200,
              backgroundColor:
                theme.palette.mode === "light"
                  ? colors.primary[900]
                  : colors.primary[400],
              color: "#fff",
              mt: 1,
              borderRadius: 2,
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
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DropDown;
