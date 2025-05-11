import {
    FormControl,
    MenuItem,
    Select,
    SelectChangeEvent,
} from "@mui/material";
import React from "react";
import "../css/index.css"; // Import your CSS file

type DropDownProps = {
    value: string | number;
    onSelect: (value: string | number) => void;
    options?: Array<string | number>;
    label?: string;
};

const DropDown: React.FC<DropDownProps> = ({ value, onSelect, options = [] }) => {
    const handleChange = (event: SelectChangeEvent<unknown>) => {
        onSelect(event.target.value as string | number);
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
                        return <span style={{ color: "#aaa" }}>Select Organization</span>;
                    }
                    return selected;
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
                            width: 200,
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
                {options.map(opt => (
                    <MenuItem key={opt} value={opt}>
                        {opt}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default DropDown;
