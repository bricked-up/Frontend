/**
 * React component for creating, editing, and listing organizations.
 * 
 * Provides UI for viewing all organizations, opening a dialog to add or edit an organization,
 * and managing organization details including name, description, members, and projects.
 * Uses Material-UI components for styling and layout.
 *
 * @component
 */
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
  /** State for the list of organizations. */
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  /** State controlling dialog visibility. */
  const [dialogOpen, setDialogOpen] = useState(false);
  /** Currently editing organization, or null when creating a new one. */
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);

  /** Form state: organization name. */
  const [orgName, setOrgName] = useState("");
  /** Form state: organization description. */
  const [description, setDescription] = useState("");
  /** Form state: list of member names. */
  const [members, setMembers] = useState<string[]>([]);
  /** Form state: temporary new member input. */
  const [newMember, setNewMember] = useState("");
  /** Form state: list of project titles. */
  const [projects, setProjects] = useState<string[]>([]);
  /** Form state: temporary new project input. */
  const [newProject, setNewProject] = useState("");

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  /**
   * Load all organizations when the component mounts.
   */
  useEffect(() => {
    setOrganizations(getAllOrganizations());
  }, []);

  /**
   * Open the dialog for creating or editing an organization.
   * If an organization is provided, pre-fill the form with its data.
   *
   * @param {Organization} [org] - Optional organization to edit.
   */
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

  /**
   * Close the dialog and reset all form state.
   */
  const closeDialog = () => {
    setEditingOrg(null);
    setOrgName("");
    setDescription("");
    setMembers([]);
    setNewMember("");
    setProjects([]);
    setNewProject("");
    setDialogOpen(false);
  };

  /**
   * Add the current newMember to the members list and clear the input.
   */
  const handleAddMember = () => {
    const name = newMember.trim();
    if (!name) return;
    setMembers(prev => [...prev, name]);
    setNewMember("");
  };

  /**
   * Remove a member by index from the members list.
   *
   * @param {number} index - Index of the member to remove.
   */
  const handleRemoveMember = (index: number) => {
    setMembers(prev => prev.filter((_, i) => i !== index));
  };

  /**
   * Add the current newProject to the projects list and clear the input.
   */
  const handleAddProject = () => {
    const title = newProject.trim();
    if (!title) return;
    setProjects(prev => [...prev, title]);
    setNewProject("");
  };

  /**
   * Remove a project by index from the projects list.
   *
   * @param {number} index - Index of the project to remove.
   */
  const handleRemoveProject = (index: number) => {
    setProjects(prev => prev.filter((_, i) => i !== index));
  };

  /**
   * Submit the form: create a new organization or update existing one,
   * then refresh the list and close the dialog.
   */
  const handleSubmit = () => {
    if (!orgName) return;
    if (editingOrg) {
      const updated = updateOrganization(editingOrg.id, { name: orgName, description, members, projects });
      setOrganizations(prev => prev.map(o => o.id === updated.id ? updated : o));
    } else {
      const created = createOrganization(orgName, description, members, projects);
      setOrganizations(prev => [...prev, created]);
    }
    closeDialog();
  };

  /**
   * Delete an organization by ID and update the list.
   *
   * @param {string} id - ID of the organization to delete.
   */
  const handleDelete = (id: string) => {
    deleteOrganization(id);
    setOrganizations(prev => prev.filter(o => o.id !== id));
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" textAlign="center" sx={{ color: colors.primary[500] }} gutterBottom>
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
        <DialogTitle>{editingOrg ? 'Edit Organization' : 'New Organization'}</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            margin="normal"
            sx={{ input: { color: 'white' } }}
            label="Name"
            value={orgName}
            onChange={e => setOrgName(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            multiline
            rows={3}
            sx={{ input: { color: colors.primary[0] } }}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <Typography variant="h6" sx={{ mt: 2 }}>Team Members</Typography>
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
              <ListItem key={i} secondaryAction={<IconButton edge="end" onClick={() => handleRemoveMember(i)}><RemoveIcon /></IconButton>}>
                <ListItemText primary={m} />
              </ListItem>
            ))}
          </List>

          <Typography variant="h6" sx={{ mt: 2 }}>Projects</Typography>
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
              <ListItem key={i} secondaryAction={<IconButton edge="end" onClick={() => handleRemoveProject(i)}><RemoveIcon /></IconButton>}>
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
