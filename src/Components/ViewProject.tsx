    // ViewTeam.tsx changed to ViewProject.tsx
    import { Box, Paper, useTheme, Typography } from "@mui/material";
    import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";
    import { tokens } from "../theme"; // Assuming tokens provides color definitions
    import Header from "./Header"; // Assuming Header component exists
    import { mockDataContacts } from "../assets/mockData"; // Using Contacts data

    // Define columns outside the component if they don't rely on component state/props
    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "registrarId", headerName: "Registrar ID", flex: 1 },
        {
            field: "name",
            headerName: "Name",
            flex: 1,
            renderCell: (params) => (
                // Use Typography for potential better control, apply fontWeight
                <Typography variant="body2" fontWeight="600">
                    {params.value}
                </Typography>
            ),
        },
        {
            field: "age",
            headerName: "Age",
            type: "number",
            headerAlign: "left",
            align: "left",
            flex: 0.5,
        },
        {
            field: "phone",
            headerName: "Phone", // Shortened name
            flex: 1,
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1.5, // Give email slightly more space
        },
        {
            field: "address",
            headerName: "Address",
            flex: 2, // Give address more space
        },
        {
            field: "city",
            headerName: "City",
            flex: 1,
        },
        {
            field: "zipCode",
            headerName: "Zip Code",
            flex: 0.8,
        },
    ];


    const ViewTeam = () => {
        const theme = useTheme();
        const colors = tokens(theme.palette.mode); // Get colors from tokens

        return (
            // Apply the consistent background styling to the outermost container
            <Box sx={{
                minHeight: "calc(100vh - 64px)", // Assume 64px fixed header
                paddingTop: "64px",          // Assume 64px fixed header
                // Use a dark base color from your tokens, adjust if needed (e.g., primary[500] or primary[600])
                backgroundColor: colors.primary[500],
                // Apply the radial gradient background effect from Activity page
                backgroundImage: 'radial-gradient(circle at top left, rgba(50, 50, 90, 0.3), transparent 40%), radial-gradient(circle at bottom right, rgba(70, 30, 50, 0.2), transparent 50%)',
                p: { xs: 2, sm: 3, md: 4 }, // Consistent responsive padding like Activity page
                boxSizing: 'border-box',
                // Remove justifyContent if the content should span width, not be centered
            }}>
                {/* Header Component */}
                <Header
                    title="Contacts" // Title reflects the data being displayed
                    subtitle="List of Contacts for Reference"
                />

                {/* Paper container for the DataGrid */}
                <Paper
                    elevation={3}
                    sx={{
                        m: { xs: "20px 0 0 0", md: "30px 0 0 0" },
                        height: "75vh", // Keep height setting for the grid area
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        // Use a slightly lighter shade from tokens for the Paper background
                        backgroundColor: colors.primary[400],
                        borderRadius: '8px',
                        overflow: 'hidden', // Important for DataGrid clipping
                    }}
                >
                    {/* Themed DataGrid */}
                    <DataGrid
                        rows={mockDataContacts}
                        columns={columns}
                        slots={{ toolbar: GridToolbar }}
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

    export default ViewTeam;
