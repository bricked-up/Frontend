// src/components/ViewMembers.tsx
import React, { useState, useMemo } from "react";
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

// Define the user type
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const sampleMembers: User[] = [
  { id: 1, name: "Alice", email: "alice@email.com", role: "Developer" },
  { id: 2, name: "Bob", email: "bob@email.com", role: "Manager" },
  { id: 3, name: "Charlie", email: "charlie@email.com", role: "Designer" },
  { id: 4, name: "Dave", email: "dave@email.com", role: "QA" },
  { id: 5, name: "Eve", email: "eve@email.com", role: "Support" },
  { id: 6, name: "Frank", email: "frank@email.com", role: "DevOps" },
  { id: 7, name: "Grace", email: "grace@email.com", role: "HR" },
  { id: 8, name: "Hannah", email: "hannah@email.com", role: "Product Owner" },
  { id: 9, name: "Ivan", email: "ivan@email.com", role: "Intern" },
  { id: 10, name: "Judy", email: "judy@email.com", role: "Developer" },
];

const ViewMembers: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  const sortedAndFiltered = useMemo(() => {
    return sampleMembers
      .filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [searchQuery]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

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
              .map((member) => (
                <TableRow key={member.id} hover>
                  <TableCell sx={{ color: "#fff" }}>{member.name}</TableCell>
                  <TableCell sx={{ color: "#fff" }}>{member.email}</TableCell>
                  <TableCell sx={{ color: "#fff" }}>{member.role}</TableCell>
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
