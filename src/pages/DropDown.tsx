import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from "@mui/material";
import React from "react";
import "../css/index.css"; // Import your CSS file

type DropDownProps = {
    value: string;
    onSelect: (value: string) => void;
};

const DropDown = ({ value, onSelect }: DropDownProps) => {
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
            <Select
                labelId="dropdown-label"
                id="dropdown"
                value={value}
                onChange={handleChange}
                size="medium"
                displayEmpty
                renderValue={(selected) => {
                    if (!selected) {
                        return <span style={{ color: "#aaa" }}>Select Organization</span>; // placeholder style
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
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Bricked-Up">Bricked-Up</MenuItem>
                <MenuItem value="George King IT">George King IT</MenuItem>
                <MenuItem value="SAP">SAP</MenuItem>
            </Select>
        </FormControl>
    );
};

export default DropDown;