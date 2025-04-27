import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  InputLabel,
} from "@mui/material";
import React from "react";
import "../css/index.css"; // Import your CSS file

type DropDownProps = {
  value: string;
  onSelect: (value: string) => void;
  options: string[];
  label?: string;
};

const DropDown = ({ value, onSelect, options, label }: DropDownProps) => {
  const handleChange = (event: SelectChangeEvent) => {
    onSelect(event.target.value);
  };

  return (
    <FormControl
      size="small"
      sx={{
        width: 200, // Consistent width
      }}
    >
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        labelId="dropdown-label"
        label={label}
        id="dropdown"
        value={value}
        onChange={handleChange}
        size="medium"
        displayEmpty
        renderValue={(selected) => {
          if (!selected) {
            return <span style={{ color: "#aaa" }}>Select</span>; // placeholder style
          }
          return selected; // actual selected text
        }}
        sx={{
          backgroundColor: "#2c2f48",
          color: "#fff",
          "& .MuiSelect-select": {
            paddingY: 1,
            paddingX: 2,
          },
          "& .MuiSelect-icon": {
            color: "#fff",
            right: 8,
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              width: 200, // Adjusted width
              backgroundColor: "#2c2f48",
              color: "#fff",
              mt: 1,
              "& .MuiMenuItem-root": {
                paddingY: 1,
                paddingX: 2,
                fontSize: "0.9rem",
                minHeight: "36px",
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
