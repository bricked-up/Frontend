import React, { useEffect, useState } from "react";

import { Link as RouterLink } from "react-router-dom";

import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Grid,
  Tab,
} from "@mui/material";

import AddCircleOutline from "@mui/icons-material/AddCircleOutline";

import AddIcon from "@mui/icons-material/Add";

import RemoveIcon from "@mui/icons-material/Remove";

import AssignmentIcon from "@mui/icons-material/Assignment";

import { useTheme } from "@mui/material/styles";

import OrganizationCard from "./OrganizationCard";

import DropDown from "../DropDown";

import { tokens } from "../../theme";

import { getUser, getOrg, getAllUsers } from "../../utils/getters.utils";

import { Organization, OrgMember } from "../../utils/types";

import { createOrganization } from "../../utils/post.utils";

const sessionUserId = localStorage.getItem("userid");

type Member = { id: number; name: string };

const CreateOrganization: React.FC = () => {
  const theme = useTheme();

  const colors = tokens(theme.palette.mode);

  const userId = sessionUserId ? parseInt(sessionUserId, 10) : -1;

  const [organizations, setOrganizations] = useState<Organization[]>([]);

  const [allMembers, setAllMembers] = useState<Member[]>([]);

  const [selectedOrgName, setSelectedOrgName] = useState<string>("");

  const [dialogOpen, setDialogOpen] = useState(false);

  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);

  const [orgName, setOrgName] = useState<string>("");

  const [members, setMembers] = useState<Member[]>([]);

  const [newMember, setNewMember] = useState<string>("");

  // Load organizations and all users

  useEffect(() => {
    const load = async () => {
      if (userId === -1) return;

      // Load my organizations

      const me = await getUser(userId);

      if (me.data) {
        const orgIds = (me.data.organizations ?? []).filter(
          (o): o is number => typeof o === "number"
        );

        const orgsRaw = await Promise.all(
          orgIds.map((oid) => getOrg(oid).then((r) => r.data))
        );

        const validOrgs = orgsRaw.filter((o): o is Organization => o !== null);

        setOrganizations(validOrgs);

        if (validOrgs.length) setSelectedOrgName(validOrgs[0].name);
      }

      // Load all users

      const usersRes = await getAllUsers();

      if (usersRes.data) {
        const opts = await Promise.all(
          usersRes.data.map(async (uid) => {
            const { data: user } = await getUser(uid);

            return { id: uid, name: user!.name };
          })
        );

        setAllMembers(opts);
      }
    };

    load();
  }, [userId]);

  // Convert backend IDs to Member objects

  const resolveMembers = (ids: number[]): Member[] =>
    ids

      .map((id) => allMembers.find((u) => u.id === id))

      .filter((m): m is Member => Boolean(m));

  const openDialog = (org?: Organization) => {
    if (org) {
      setEditingOrg(org);

      setOrgName(org.name);

      const memberIds = (org.members ?? []).map((m) =>
        typeof m === "number" ? m : (m as OrgMember).userId
      );

      setMembers(resolveMembers(memberIds));
    }

    setDialogOpen(true);
  };

  const closeDialog = () => {
    setEditingOrg(null);

    setOrgName("");

    setMembers([]);

    setNewMember("");

    setDialogOpen(false);
  };

  const handleSubmit = async () => {
    if (!orgName.trim()) {
      return alert("Please enter an organization name");
    }

    if (!editingOrg) {
      const createRes = await createOrganization({ orgName }, "create-org");

      if (createRes.status !== 201 || !createRes.organization) {
        return alert("Create failed: " + createRes.error);
      }

      setOrganizations((prev) => [...prev, createRes.organization!]);
    }

    closeDialog();
  };

  const handleAddMember = () => {
    if (newMember) {
      const user = allMembers.find((u) => u.name === newMember);

      if (user && !members.some((m) => m.id === user.id)) {
        setMembers((prev) => [...prev, user]);
      }

      setNewMember("");
    }
  };

  const handleRemoveMember = (index: number) => {
    setMembers((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Tab
          icon={<AssignmentIcon />}
          iconPosition="start"
          label="Organizations"
          sx={{
            color:
              theme.palette.mode === "dark"
                ? colors.greenAccent[400]
                : colors.blueAccent[600],
          }}
        />

        {organizations.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <DropDown
              value={selectedOrgName}
              onSelect={setSelectedOrgName}
              options={["", ...organizations.map((o) => o.name)]}
            />
          </Box>
        )}

        <Grid container spacing={4}>
          {organizations

            .filter((o) => !selectedOrgName || o.name === selectedOrgName)

            .map((org) => (
              <Grid item xs={12} sm={6} md={4} key={org.id}>
                <OrganizationCard
                  organization={org}
                  memberUsers={[]}
                  onEdit={() => openDialog(org)}
                />
              </Grid>
            ))}
        </Grid>
      </Box>

      <Box sx={{ position: "fixed", bottom: 24, right: 24 }}>
        <Button
          startIcon={<AddCircleOutline />}
          variant="contained"
          color="secondary"
          onClick={() => openDialog()}
        >
          New Organization
        </Button>
      </Box>

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingOrg ? "Edit Organization" : "New Organization"}
        </DialogTitle>

        <DialogContent dividers>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
          />

          {editingOrg && (
            <>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Team Members
              </Typography>

              <Box
                sx={{ display: "flex", gap: 1, alignItems: "center", mt: 1 }}
              >
                <DropDown
                  value={newMember}
                  onSelect={setNewMember}
                  options={["", ...allMembers.map((u) => u.name)]}
                />

                <IconButton onClick={handleAddMember}>
                  <AddIcon />
                </IconButton>
              </Box>

              <List dense>
                {members.map((m, i) => (
                  <ListItem
                    key={i}
                    component={RouterLink}
                    to={`/user/${m.id}/aboutuser`}
                    secondaryAction={
                      <IconButton onClick={() => handleRemoveMember(i)}>
                        <RemoveIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={m.name}
                      primaryTypographyProps={{ color: "text.primary" }}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>

          <Button variant="contained" color="secondary" onClick={handleSubmit}>
            {editingOrg ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateOrganization;
