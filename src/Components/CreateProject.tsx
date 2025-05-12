// src/Components/CreateProject.tsx
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Alert,
  Box,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  InputAdornment,
  MenuItem,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import '../css/CreateProject.css';
import { createProject, NewProjectParams, CreateProjectResult } from '../utils/post.utils';
import { getOrg } from '../utils/getters.utils';

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
        const response = await getOrg(); // Fetch from the database
        if (response.status === 200) {
          const dbOrganizations: Organization[] = response.data;
          setOrganizations(dbOrganizations);

          // ✅ Auto-select the organization if only one exists
          if (dbOrganizations.length === 1) {
            setOrgId(String(dbOrganizations[0].id));
          }
        } else {
          setError('Failed to load organizations. Please try refreshing the page.');
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
      orgid: Number(orgId),
      budget: budgetValue,
      charter: charter.trim(),
      archived: false, 
    };

    try {
      const {status, project, error }: CreateProjectResult = await createProject(newProjectParams, 'create-proj');

      if (status === 201 || status === 200) {
        setSuccessMessage(`Project "${project?.name || name}" created successfully! Redirecting...`);
        setName('');
        setBudget('');
        setCharter('');
        setOrgId('');
        setTimeout(() => navigate('/viewProject'), 2000);
      } else {
        setError(error || 'Failed to create project. Please try again.');
        console.error('Project creation failed:', error);
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      setError(`An unexpected error occurred: ${error.message || 'Unknown error'}. Please try again.`);
    } finally {
      setFormSubmitting(false);
    }
  };

  if (loading) {
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
            sx={{ color: theme.palette.text.primary }}
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
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />

          <TextField
            select
            label="Organization"
            value={orgId}
            fullWidth
            required
            disabled={organizations.length === 1 || formSubmitting}
          >
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
