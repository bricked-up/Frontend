// ViewOrg.tsx
import { useState } from "react";
import { Box, Paper, useTheme } from "@mui/material";
import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";
import { tokens } from "../theme";
import Header from "../Components/Header";
import DropDown from "./DropDown";

const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 2 },
    { field: "role", headerName: "Role", flex: 1 },
];

const allRows = [
    { id: 1, name: "Bilbo", email: "k@gmail.co", role: "Admin", organization: "Bricked-Up" },
    { id: 5, name: "Gandalf", email: "bigstick@gmx.de", role: "Admin", organization: "SAP" },
    { id: 2, name: "Frodo", email: "anva@outlook.com", role: "Member", organization: "George King IT" },
    { id: 3, name: "Samwise", email: "bigtoesam@yahoo.com", role: "Member", organization: "Bricked-Up" },
];

const ViewOrg = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [selectedOrg, setSelectedOrg] = useState("");

    const filteredRows = selectedOrg
        ? allRows.filter((row) => row.organization === selectedOrg)
        : allRows;

    return (
        <Box
            sx={{
                minHeight: "calc(100vh - 64px)",
                paddingTop: "64px",
                backgroundColor: colors.primary[500],
                backgroundImage:
                    "radial-gradient(circle at top left, rgba(50, 50, 90, 0.3), transparent 40%), radial-gradient(circle at bottom right, rgba(70, 30, 50, 0.2), transparent 50%)",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flexGrow: 1,
                overflow: "auto",
                width: "100%",
                //p: { xs: 2, sm: 3, md: 4 },
            }}
        >
            <Header title="Organizations" subtitle="" />

            <Paper
                sx={{
                    width: { xs: "100%", sm: "95%", md: "90%", lg: "85%" }, // responsive
                    m: { xs: "20px", md: "30px" },              // responsive top margin
                    height: "75vh",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: colors.primary[400],
                    borderRadius: "8px",
                    overflow: "hidden",
                }}
            >
                <Box sx={{ p: 2 , display: 'flex', justifyContent: 'left' }}>
                    <DropDown value={selectedOrg} onSelect={setSelectedOrg} />
                </Box>

                {/* Themed DataGrid */}
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    slots={{ toolbar: GridToolbar, }}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 10, page: 0 },
                        },
                    }}
                    pageSizeOptions={[5, 10, 25, 50]}
                    sx={{
                        border: "none",
                        color: colors.grey[100],

                        // -- Headers --
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: colors.blueAccent[700],
                            color: colors.grey[100],
                            borderBottom: `1px solid ${colors.primary[300]}`,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            fontSize: '0.85rem',
                        },
                        "& .MuiDataGrid-columnHeaderTitle": {
                            fontWeight: 600,
                        },

                        // -- Cells --
                        "& .MuiDataGrid-cell": {
                            borderBottom: `1px solid ${colors.primary[300]}`,
                            padding: "10px 15px",
                            fontSize: '0.9rem',
                            '&:focus, &:focus-within': { // Remove default blue outline on cell focus
                                outline: 'none',
                            },
                        },

                        // -- Rows --
                        "& .MuiDataGrid-row": {
                            transition: 'background-color 0.2s ease',
                            '&:hover': {
                                backgroundColor: colors.primary[500],
                                cursor: 'default',
                            },
                            '&.Mui-selected': {
                                backgroundColor: colors.blueAccent[800],
                                '&:hover': {
                                    backgroundColor: colors.blueAccent[900],
                                },
                            },
                        },

                        // -- Virtual Scroller (contains the rows) --
                        "& .MuiDataGrid-virtualScroller": {
                            backgroundColor: colors.primary[400], // Base background for rows area
                        },
                        // Scrollbar Styling (Webkit browsers)
                        "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
                            width: "8px", height: "8px",
                        },
                        "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track": {
                            background: colors.primary[300], borderRadius: "4px",
                        },
                        "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb": {
                            backgroundColor: colors.grey[600], borderRadius: "4px", border: `1px solid ${colors.primary[300]}`,
                        },
                        "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb:hover": {
                            background: colors.grey[500],
                        },

                        // -- Footer --
                        "& .MuiDataGrid-footerContainer": {
                            borderTop: `1px solid ${colors.primary[300]}`,
                            backgroundColor: colors.blueAccent[700],
                            color: colors.grey[100],
                        },
                        "& .MuiTablePagination-root, & .MuiIconButton-root, & .MuiSvgIcon-root": {
                            color: colors.grey[100], // Ensure footer elements are visible
                        },
                        "& .MuiIconButton-root:hover": {
                            backgroundColor: colors.primary[500],
                        },

                        // -- Toolbar --
                        "& .MuiDataGrid-toolbarContainer": {
                            padding: "10px 15px",
                            "& .MuiButton-text": {
                                color: colors.grey[100],
                                '&:hover': { backgroundColor: colors.primary[500], }
                            },
                            "& .MuiInputBase-root": { // Style the search input in toolbar
                                color: colors.grey[100],
                                '& .MuiInputBase-input': { color: colors.grey[100], },
                                '& fieldset': { borderColor: colors.grey[700], },
                                '&:hover fieldset': { borderColor: colors.grey[500], },
                            },
                            "& .MuiSvgIcon-root": { // Ensure toolbar icons are visible
                                color: colors.grey[300],
                            }
                        },

                        // -- Checkbox --
                        "& .MuiCheckbox-root": {
                            color: `${colors.greenAccent[400]} !important`,
                            '&.Mui-checked': { color: `${colors.greenAccent[300]} !important`, }
                        },

                        // -- No Rows Overlay --
                        "& .MuiDataGrid-overlay": {
                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        },
                        "& .MuiDataGrid-columnSeparator": { display: 'none', },
                    }}
                />
            </Paper>
        </Box>
    );
};

export default ViewOrg;