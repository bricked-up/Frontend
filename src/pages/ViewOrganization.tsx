// src/pages/ViewOrg.tsx
import React, { useEffect, useState } from "react";
import { Box, Paper, useTheme, Typography } from "@mui/material";
import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";
import { tokens } from "../theme";
import Header from "../Components/Header";
import DropDown from "../Components/DropDown";
import { getUser, getOrg } from "../utils/getters.utils";
import { Organization, OrgMember, Project } from "../utils/types";

const orgColumns: GridColDef[] = [
  { field: "id", headerName: "ID", flex: 0.5 },
  { field: "name", headerName: "Name", flex: 1 },
];
const memberColumns: GridColDef[] = [
  { field: "id", headerName: "User ID", flex: 1 },
  { field: "name", headerName: "Name", flex: 2 },
];
const projectColumns: GridColDef[] = [
  { field: "id", headerName: "Proj ID", flex: 1 },
  { field: "name", headerName: "Name", flex: 2 },
];

export default function ViewOrg() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [selectedOrgName, setSelectedOrgName] = useState("");
  const [memberRows, setMemberRows] = useState<{ id: number; name: string }[]>(
    []
  );
  const [projectRows, setProjectRows] = useState<
    { id: number; name: string }[]
  >([]);

  // 1) load user's orgs on mount
  useEffect(() => {
    (async () => {
      const userId = Number(localStorage.getItem("userid"));
      const userRes = await getUser(userId);
      if (!userRes.data) return;
      const orgIds = (userRes.data.organizations ?? []).filter(
        (o): o is number => typeof o === "number"
      );
      const orgResults = await Promise.all(orgIds.map((id) => getOrg(id)));
      setOrgs(orgResults.filter((r) => r.data).map((r) => r.data!));
    })();
  }, []);

  // derive selection
  const selectedOrg = orgs.find((o) => o.name === selectedOrgName);
  const selectedOrgId = selectedOrg?.id;

  // 2) fetch members/projects when selection changes
  useEffect(() => {
    if (!selectedOrgId) {
      setMemberRows([]);
      setProjectRows([]);
      return;
    }
    (async () => {
      const orgRes = await getOrg(selectedOrgId);
      if (!orgRes.data) return;

      // members
      const mlist: OrgMember[] = orgRes.data.members ?? [];
      const members = await Promise.all(
        mlist.map((m) =>
          getUser(typeof m === "number" ? m : m.userId).then((r) => ({
            id: typeof m === "number" ? m : m.userId,
            name: r.data?.name ?? "‹unknown›",
          }))
        )
      );
      setMemberRows(members);

      // projects (already full objects on getOrg)
      const plist: Project[] = orgRes.data.projects ?? [];
      setProjectRows(plist.map((p) => ({ id: p.id, name: p.name })));
    })();
  }, [selectedOrgId]);

  const gridSx = {
    border: "none",
    color: colors.grey[100],
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: colors.blueAccent[700],
      color: colors.grey[100],
      borderBottom: `1px solid ${colors.primary[300]}`,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      fontSize: "0.85rem",
    },
    "& .MuiDataGrid-cell": {
      borderBottom: `1px solid ${colors.primary[300]}`,
      padding: "10px 15px",
      fontSize: "0.9rem",
      "&:focus, &:focus-within": { outline: "none" },
    },
    "& .MuiDataGrid-row:hover": { backgroundColor: colors.primary[500] },
    "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
    "& .MuiDataGrid-footerContainer": {
      borderTop: `1px solid ${colors.primary[300]}`,
      backgroundColor: colors.blueAccent[700],
      color: colors.grey[100],
    },
    "& .MuiDataGrid-toolbarContainer .MuiButton-text, .MuiSvgIcon-root, .MuiTablePagination-root":
      {
        color: colors.grey[100],
      },
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        pt: 2,
        backgroundColor:
          theme.palette.mode === "light"
            ? colors.primary[900]
            : colors.primary[500],
        backgroundImage:
          "radial-gradient(circle at top left, rgba(50,50,90,0.3), transparent 40%)," +
          " radial-gradient(circle at bottom right, rgba(70,30,50,0.2), transparent 50%)",
      }}
    >
      <Header title="Organizations" subtitle="" />

      <Paper
        sx={{
          m: 3,
          p: 2,
          backgroundColor: colors.primary[400],
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ mb: 2, display: "flex" }}>
          <DropDown
            value={selectedOrgName}
            onSelect={setSelectedOrgName}
            options={orgs.map((o) => o.name)}
          />
        </Box>

        <Box sx={{ display: "flex", flex: 1, gap: 2, overflow: "hidden" }}>
          {selectedOrgId ? (
            <>
              {/* Members panel */}
              <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Box sx={{ flex: 1 }}>
                  <DataGrid
                    rows={memberRows}
                    columns={memberColumns}
                    getRowId={(r) => r.id}
                    pageSizeOptions={[5]}
                    slots={{ toolbar: GridToolbar }}
                    sx={gridSx}
                  />
                </Box>
              </Box>

              {/* Projects panel */}
            </>
          ) : (
            /* Org list */
            <Box sx={{ flex: 1 }}>
              <DataGrid
                rows={orgs}
                columns={orgColumns}
                getRowId={(r) => r.id!}
                pageSizeOptions={[5, 10]}
                slots={{ toolbar: GridToolbar }}
                sx={gridSx}
              />
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
