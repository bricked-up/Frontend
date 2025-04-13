// src/components/ViewMembers.tsx
import React, { useState, useMemo } from "react";
import { User } from "../utils/types";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  TablePagination,
  TextField,
} from "@mui/material";

/**
 * Sample user data for demonstration.
 * `role` is mocked since the original User type doesn't include it.
 */
const sampleMembers: (User & { role?: string })[] = [
  { email: "alice@email.com", displayName: "Alice", password: "", verified: true, role: "Developer" },
  { email: "bob@email.com", displayName: "Bob", password: "", verified: true, role: "Manager" },
  { email: "charlie@email.com", displayName: "Charlie", password: "", verified: true, role: "Designer" },
  { email: "dave@email.com", displayName: "Dave", password: "", verified: true, role: "QA" },
  { email: "eve@email.com", displayName: "Eve", password: "", verified: true, role: "Support" },
  { email: "frank@email.com", displayName: "Frank", password: "", verified: true, role: "DevOps" },
  { email: "grace@email.com", displayName: "Grace", password: "", verified: true, role: "HR" },
  { email: "hannah@email.com", displayName: "Hannah", password: "", verified: true, role: "Product Owner" },
  { email: "ivan@email.com", displayName: "Ivan", password: "", verified: true, role: "Intern" },
  { email: "judy@email.com", displayName: "Judy", password: "", verified: true, role: "Developer" },
];

/**
 * Component to view a list of members with search and pagination features.
 * Uses sample static data.
 */
const ViewMembers: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  /**
   * Returns filtered and alphabetically sorted list based on displayName.
   */
  const sortedAndFiltered = useMemo(() => {
    return sampleMembers
      .filter((user) =>
        user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [searchQuery]);

  /**
   * Handles pagination page change.
   * @param _ Event (ignored)
   * @param newPage New page number
   */
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  /**
   * Handles change in number of rows per page.
   * @param event Input change event
   */
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: "#1E1E1E", borderRadius: 2 }}>
      <Typography variant="h5" sx={{ color: "#fff", marginBottom: 2 }}>
        View Members
      </Typography>
      <TextField
        placeholder="Search by name..."
        fullWidth
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          marginBottom: 2,
          input: { color: "#fff" },
          fieldset: { borderColor: "#555" },
          backgroundColor: "#2A2A2A",
        }}
      />
      <TableContainer component={Paper} sx={{ backgroundColor: "#1E1E1E" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1A1A1A" }}>
              <TableCell sx={{ color: "#aaa" }}>Name</TableCell>
              <TableCell sx={{ color: "#aaa" }}>Email</TableCell>
              <TableCell sx={{ color: "#aaa" }}>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedAndFiltered
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((member, index) => (
                <TableRow key={index} hover>
                  <TableCell sx={{ color: "#fff" }}>{member.displayName}</TableCell>
                  <TableCell sx={{ color: "#fff" }}>{member.email}</TableCell>
                  <TableCell sx={{ color: "#fff" }}>{member.role ?? "—"}</TableCell>
                </TableRow>
              ))}
            {sortedAndFiltered.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} sx={{ color: "#fff", textAlign: "center" }}>
                  No members found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={sortedAndFiltered.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 15]}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ color: "#fff", backgroundColor: "#1A1A1A" }}
      />
    </Box>
  );
};

export default ViewMembers;
