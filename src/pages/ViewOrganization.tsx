import React, { useState } from "react";
import { Box, Paper, useTheme, Button, Typography } from "@mui/material";
import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";
import { tokens } from "../theme";
import Header from "../Components/Header";
import DropDown from "../Components/DropDown";
import { useUser } from "../hooks/UserContext";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", flex: 0.5 },
  { field: "name", headerName: "Name", flex: 1 },
  { field: "email", headerName: "Email", flex: 2 },
  { field: "role", headerName: "Role", flex: 1 },
];

const columnsOrg: GridColDef[] = [
  { field: "id", headerName: "ID", flex: 0.5 },
  { field: "name", headerName: "Name", flex: 1 },
  {
    field: "projects",
    headerName: "Projects",
    flex: 2,
    renderCell: (params) => params.value.join(", "),
  },
];

const allRows = [
  {
    id: 1,
    name: "Bilbo",
    email: "k@gmail.co",
    role: "Admin",
    organization: "Bricked-Up",
  },
  {
    id: 5,
    name: "Gandalf",
    email: "bigstick@gmx.de",
    role: "Admin",
    organization: "SAP",
  },
  {
    id: 2,
    name: "Frodo",
    email: "anva@outlook.com",
    role: "Member",
    organization: "George King IT",
  },
  {
    id: 3,
    name: "Samwise",
    email: "bigtoesam@yahoo.com",
    role: "Member",
    organization: "Bricked-Up",
  },
];

const allRowsOrg = [
  { id: 1, name: "Bricked-Up", projects: ["Project A", "Project B"] },
  { id: 2, name: "SAP", projects: ["Project C"] },
  { id: 3, name: "George King IT", projects: ["Project D", "Project E"] },
];

const ViewOrg = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedOrg, setSelectedOrg] = useState("");
  const { user } = useUser();

  const role = user?.role;

  const filteredRows = selectedOrg
    ? allRows.filter((row) => row.organization === selectedOrg)
    : allRows;

  const filteredRowsOrg = selectedOrg
    ? allRowsOrg.filter((row) => row.name === selectedOrg)
    : allRowsOrg;

  const deleteOrganization = async () => {
    if (!selectedOrg) {
      alert("Please select an organization to delete.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${selectedOrg}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const org = allRowsOrg.find((o) => o.name === selectedOrg);
      if (!org) {
        alert("Selected organization not found.");
        return;
      }

      const response = await fetch("/delete-org", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `orgid=${org.id}`,
      });

      if (response.ok) {
        alert("Organization deleted successfully.");
        setSelectedOrg("");
      } else {
        const error = await response.text();
        alert("Failed to delete organization: " + error);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An unexpected error occurred.");
    }
  };

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
          <DropDown value={selectedOrg} onSelect={setSelectedOrg} />
          <Typography
            variant="h5"
            sx={{
              padding: 3,
              textAlign: "right",
              marginLeft: "500px",
              color:
                theme.palette.mode === "light"
                  ? colors.grey[700]
                  : colors.grey[100],
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              fontSize: "1.2rem",
            }}
          >
            Organization Projects
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flex: 1, gap: 2, padding: 2 }}>
          <Box sx={{ flex: 1 }}>
            <DataGrid
              rows={filteredRows}
              columns={columns}
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
              rows={filteredRowsOrg}
              columns={columnsOrg}
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




