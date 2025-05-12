// src/Components/CreateProject.tsx
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  // FormControl, // Not used directly in this snippet for org selection, assuming organizations are fetched
  // InputLabel, // Not used directly
  // Select, // Not used directly
  // MenuItem, // Not used directly
  Alert,
  Box,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../css/CreateProject.css';
// Import the necessary function and types from post.utils.ts
import { createProject, NewProjectParams, CreateProjectResult } from '../utils/post.utils';
// Assuming your Organization type is defined elsewhere or you use a simplified one here
// For fetching organizations, you might use a getter from getters.utils.ts if available

type Organization = {
  id: number;
  name: string;
};

const CreateProject: React.FC = () => {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [budget, setBudget] = useState<string>('');
  const [charter, setCharter] = useState('');
  const [orgId, setOrgId] = useState<string>(''); // Keep as string for Select, convert to number on submit
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // For fetching organizations
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (theme.palette.mode === 'dark') {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.setAttribute('data-theme', 'light');
    }
  }, [theme.palette.mode]);

  useEffect(() => {
    const fetchUserOrganizations = async () => {
      setLoading(true);
      try {
        // Replace with actual organization fetching logic if needed
        // For example, if you have a function like getOrganizations() in getters.utils.ts
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        const mockOrganizations: Organization[] = [
          { id: 1, name: 'Tech Innovators Inc.' },
          { id: 2, name: 'Design Studio Co.' },
          { id: 3, name: 'Marketing Professionals LLC' },
          // Add more mock organizations or fetch dynamically
        ];
        setOrganizations(mockOrganizations);
        if (mockOrganizations.length > 0) {
          // Optionally set a default orgId if desired
          // setOrgId(String(mockOrganizations[0].id));
        }
      } catch (err) {
        console.error('Failed to load organizations:', err);
        setError('Failed to load organizations. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };
    fetchUserOrganizations();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !budget.trim() || !charter.trim() || !orgId) {
      setError('Please fill in all required fields.');
      setSuccessMessage(null);
      return;
    }

    const budgetValue = parseFloat(budget);
    if (isNaN(budgetValue) || budgetValue <= 0) {
      setError('Please enter a valid, positive budget amount.');
      setSuccessMessage(null);
      return;
    }

    setFormSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    const newProjectParams: NewProjectParams = {
      name: name.trim(),
      orgId: Number(orgId),
      tag: '', // Defaulting tag to empty. Add a form field if it needs to be user-defined.
      budget: budgetValue,
      charter: charter.trim(),
      archived: false, // Defaulting archived to false.
      // members and issues are optional in NewProjectParams, defaulting to undefined or [] if not collected.
      // members: [],
      // issues: [],
    };

    try {
      // Use the actual API endpoint for creating projects.
      // The second argument to createProject is the endpoint string.
      const result: CreateProjectResult = await createProject(newProjectParams, 'create-proj');

      if (result.status === 201 || result.status === 200) { // Check for successful creation status codes
        setSuccessMessage(`Project "${result.project?.name || name}" created successfully! Redirecting...`);
        // Clear form fields after successful submission
        setName('');
        setBudget('');
        setCharter('');
        setOrgId('');
        setTimeout(() => navigate('/viewProject'), 2000); // Navigate to view projects page
      } else {
        setError(result.error || 'Failed to create project. Please try again.');
        console.error('Project creation failed:', result);
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      setError(`An unexpected error occurred: ${error.message || 'Unknown error'}. Please try again.`);
    } finally {
      setFormSubmitting(false);
    }
  };

  if (loading && organizations.length === 0) { // Adjusted loading condition
    return (
      <Box className="create-project-container" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading organization data...</Typography>
      </Box>
    );
  }

  return (
    <Box className="create-project-container">
      <Paper elevation={3} className="create-project-paper">
        <Box className="create-project-header">
          <Typography
            variant="h6"
            component="h2"
            fontWeight="600"
            sx={{ color: theme.palette.text.primary }} // Use theme's primary text color
          >
            Create New Project
          </Typography>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

        <Box component="form" onSubmit={handleSubmit} className="create-project-form">
          <TextField
            label="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            disabled={formSubmitting}
            InputProps={{
              sx: {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.background.paper, // Use paper background for contrast
              },
            }}
            InputLabelProps={{
              sx: { color: theme.palette.text.secondary } // Ensure label is visible
            }}
          />

          <TextField
            label="Budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            fullWidth
            required
            type="number"
            disabled={formSubmitting}
            InputProps={{
              startAdornment: <InputAdornment position="start" sx={{ color: theme.palette.text.secondary }}>$</InputAdornment>,
              sx: {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.background.paper,
              },
            }}
            InputLabelProps={{
              sx: { color: theme.palette.text.secondary }
            }}
          />
          
          {/* Organization Dropdown */}
          <TextField // Using TextField as a Select
            select
            label="Organization"
            value={orgId}
            onChange={(e) => setOrgId(e.target.value)}
            fullWidth
            required
            disabled={formSubmitting || loading || organizations.length === 0}
            SelectProps={{
              native: false, // Use MUI's Menu for dropdown
              sx: {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.background.paper,
              }
            }}
            InputLabelProps={{
              sx: { color: theme.palette.text.secondary }
            }}
            helperText={organizations.length === 0 && !loading ? "No organizations available" : ""}
          >
            <MenuItem value="" disabled>
              <em>Select an Organization</em>
            </MenuItem>
            {organizations.map((org) => (
              <MenuItem key={org.id} value={String(org.id)}>
                {org.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Project Charter"
            value={charter}
            onChange={(e) => setCharter(e.target.value)}
            fullWidth
            multiline
            rows={4}
            required
            disabled={formSubmitting}
            InputProps={{
              sx: {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.background.paper,
              },
            }}
            InputLabelProps={{
              sx: { color: theme.palette.text.secondary }
            }}
          />

          <Box className="create-project-buttons" sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={() => navigate(-1)} disabled={formSubmitting} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={formSubmitting} color="primary">
              {formSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Create Project'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateProject;