import React, { useState, useEffect } from "react";
import { Box, Paper, useTheme, Typography } from "@mui/material";
import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";
import { tokens } from "../theme";
import Header from "../Components/Header";
import DropDown from "../Components/DropDown";
import { useUser } from "../hooks/UserContext";
import { getOrganizationsFromStore } from "../utils/OrganizationStore";
import { Organization } from "../utils/Organization";

// User table columns
const userColumns: GridColDef[] = [
  { field: "id", headerName: "ID", flex: 0.5 },
  { field: "name", headerName: "Name", flex: 1 },
  { field: "email", headerName: "Email", flex: 2 },
  { field: "role", headerName: "Role", flex: 1 },
  { field: "organization", headerName: "Organization", flex: 1 },
];

// Organization table columns
const orgColumns: GridColDef[] = [
  { field: "id", headerName: "ID", flex: 0.5 },
  { field: "name", headerName: "Name", flex: 1 },
  {
    field: "members",
    headerName: "Members",
    flex: 2,
    renderCell: params => Array.isArray(params.value) ? params.value.join(", ") : "",
  },
  {
    field: "projects",
    headerName: "Projects",
    flex: 2,
    renderCell: params => Array.isArray(params.value) ? params.value.join(", ") : "",
  },
];

// Sample users
const allUsers = [
  { id: 1, name: "Bilbo", email: "k@gmail.co", role: "Admin", organization: "Bricked-Up" },
  { id: 5, name: "Gandalf", email: "bigstick@gmx.de", role: "Admin", organization: "SAP" },
  { id: 2, name: "Frodo", email: "anva@outlook.com", role: "Member", organization: "George King IT" },
  { id: 3, name: "Samwise", email: "bigtoesam@yahoo.com", role: "Member", organization: "Bricked-Up" },
];

const ViewOrg = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedOrg, setSelectedOrg] = useState("");
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const { user } = useUser();

  useEffect(() => {
    setOrgs(getOrganizationsFromStore());
  }, []);

  const filteredUsers = selectedOrg ? allUsers.filter(u => u.organization === selectedOrg) : allUsers;
  const filteredOrgs = selectedOrg ? orgs.filter(o => o.name === selectedOrg) : orgs;

  const dataGridStyle = {
    border: "none",
    "& .MuiDataGrid-cell": {
      borderBottom: "none",
    },
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: colors.blueAccent[700],
      borderBottom: "none",
    },
    "& .MuiDataGrid-virtualScroller": {
      backgroundColor: colors.primary[400],
    },
    "& .MuiDataGrid-footerContainer": {
      borderTop: "none",
      backgroundColor: colors.blueAccent[700],
    },
    "& .MuiCheckbox-root": {
      color: `${colors.greenAccent[200]} !important`,
    },
    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
      color: `${colors.grey[100]} !important`,
    },
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        paddingTop: "64px",
        backgroundColor:
          theme.palette.mode === "light"
            ? colors.primary[900]
            : colors.primary[400],
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flexGrow: 1,
        overflow: "auto",
        width: "100%",
      }}
    >
      <Header title="Organizations" subtitle="" />
      <Paper
        sx={{
          width: { xs: "100%", sm: "95%", md: "90%", lg: "85%" },
          m: { xs: "20px", md: "30px" },
          height: "75vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: colors.primary[400],
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 2, display: "flex", justifyContent: "left" }}>
          <DropDown value={selectedOrg} onSelect={setSelectedOrg} options={orgs.map(o => o.name)} />
        </Box>

        <Box sx={{ display: "flex", flex: 1, gap: 2, padding: 2 }}>
          <Box sx={{ flex: 1 }}>
            <DataGrid
              rows={filteredUsers}
              columns={userColumns}
              slots={{ toolbar: GridToolbar }}
              initialState={{
                pagination: { paginationModel: { pageSize: 10, page: 0 } },
              }}
              pageSizeOptions={[5, 10, 25, 50]}
              sx={dataGridStyle}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <DataGrid
              rows={filteredOrgs}
              columns={orgColumns}
              slots={{ toolbar: GridToolbar }}
              initialState={{
                pagination: { paginationModel: { pageSize: 10, page: 0 } },
              }}
              pageSizeOptions={[5, 10, 25, 50]}
              sx={dataGridStyle}
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ViewOrg;

