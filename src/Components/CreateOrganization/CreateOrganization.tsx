import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Grid,
} from "@mui/material";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useTheme } from "@mui/material/styles";
import {
  getAllOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization,
} from "./Organizations";
import { Organization } from "../../utils/Organization";
import OrganizationCard from "./OrganizationCard";
import { tokens } from "../../theme";

const CreateOrganization: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);

  const [orgName, setOrgName] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [newMember, setNewMember] = useState("");
  const [projects, setProjects] = useState<string[]>([]);
  const [newProject, setNewProject] = useState("");
  const [descriptionTouched, setDescriptionTouched] = useState(false);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    setOrganizations(getAllOrganizations());
  }, []);

  const openDialog = (org?: Organization) => {
    if (org) {
      setEditingOrg(org);
      setOrgName(org.name);
      setDescription(org.description);
      setMembers(org.members || []);
      setProjects(org.projects || []);
    }
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setEditingOrg(null);
    setOrgName("");
    setDescription("");
    setMembers([]);
    setNewMember("");
    setProjects([]);
    setNewProject("");
    setDialogOpen(false);
    setDescriptionTouched(false);
  };

  const handleAddMember = () => {
    const name = newMember.trim();
    if (!name) {
      alert("Please enter a member name");
      return;
    }
    setMembers(prev => [...prev, name]);
    setNewMember("");
  };

  const handleRemoveMember = (index: number) => {
    setMembers(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddProject = () => {
    const title = newProject.trim();
    if (!title.trim()) {
      alert("Please enter a project name"); 
      return;
    }
    setProjects(prev => [...prev, title]);
    setNewProject("");
  };

  const handleRemoveProject = (index: number) => {
    setProjects(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!orgName) {
      alert("Please enter a org name"); 
      return;
    }
    if (editingOrg) {
      const updated = updateOrganization(editingOrg.id, {
        name: orgName,
        description,
        members,
        projects,
      });
      setOrganizations(prev => prev.map(o => o.id === updated.id ? updated : o));
    } else {
      const created = createOrganization(orgName, description, members, projects);
      setOrganizations(prev => [...prev, created]);
    }
    closeDialog();
  };

  const handleDelete = (id: string) => {
    deleteOrganization(id);
    setOrganizations(prev => prev.filter(o => o.id !== id));
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Typography
          variant="h4"
          textAlign="center"
          sx={{
            color:
              theme.palette.mode === "dark"
                ? colors.greenAccent[400]
                : colors.blueAccent[600],
          }}
          gutterBottom
        >
          Organization Manager
        </Typography>

        <Grid container spacing={4} justifyContent="flex-start">
          {organizations.map(org => (
            <Grid item xs={12} sm={6} md={4} key={org.id}>
              <OrganizationCard
                organization={org}
                onEdit={openDialog}
                onDelete={handleDelete}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ position: 'fixed', bottom: 24, right: 24 }}>
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
          {editingOrg ? 'Edit Organization' : 'New Organization'}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            sx={{ input: { color: 'white' } }}
            value={orgName}
            onChange={e => setOrgName(e.target.value)}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Description"
            multiline
            rows={3}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setDescriptionTouched(true);

            }}

            InputLabelProps={{
              style: {
                color: descriptionTouched
                  ? colors.greenAccent[500]
                  : colors.primary[700],
              },

            }}
            sx={{
              input: { color: 'white' },

              textarea: {
                color: "white",
              },
              transition: 'color 0.3s ease-in-out',
            }}
          />

          <Typography variant="h6" sx={{ mt: 2 }}>
            Team Members
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
            <TextField
              label="Add member"
              value={newMember}
              onChange={e => setNewMember(e.target.value)}
              sx={{ input: { color: 'white' } }}
            />
            <IconButton onClick={handleAddMember}><AddIcon /></IconButton>
          </Box>
          <List>
            {members.map((m, i) => (
              <ListItem
                key={i}
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleRemoveMember(i)}>
                    <RemoveIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={m} />
              </ListItem>
            ))}
          </List>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Projects
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
            <TextField
              label="Add project"
              value={newProject}
              onChange={e => setNewProject(e.target.value)}
              sx={{ input: { color: 'white' } }}
            />
            <IconButton onClick={handleAddProject}><AddIcon /></IconButton>
          </Box>
          <List>
            {projects.map((p, i) => (
              <ListItem
                key={i}
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleRemoveProject(i)}>
                    <RemoveIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={p} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="secondary">
            {editingOrg ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateOrganization;