// CreateProject.tsx
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Box,
  Typography,
  Paper,
  // Divider, // Not explicitly used, h1 margin and form gap handle spacing
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../css/CreateProject.css'; // Ensure this CSS is loaded
import { createProject, NewProjectParams } from '../utils/post.utils'; // Adjust the import path

type Organization = {
  id: number;
  name: string;
};

const CreateProject: React.FC = () => {
  const [name, setName] = useState('');
  const [budget, setBudget] = useState<string>('');
  const [charter, setCharter] = useState('');
  const [orgId, setOrgId] = useState<string>('');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserOrganizations = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        const mockOrganizations = [
          { id: 1, name: 'Tech Innovators Inc.' },
          { id: 2, name: 'Design Studio Co.' },
          { id: 3, name: 'Marketing Professionals LLC' },
        ];
        setOrganizations(mockOrganizations);
      } catch (err) {
        console.error("Failed to load organizations:", err);
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
      tag: '',
      budget: budgetValue,
      charter: charter.trim(),
      archived: false,
      members: [],
      issues: [],
    };

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      // const result = await createProject(newProjectParams, 'projects');
      // Forcing a mock success for demonstration
      const result = { project: { ...newProjectParams, id: Date.now() } , error: null };


      if (result.project) {
        setSuccessMessage('Project created successfully! Redirecting...');
        setName('');
        setBudget('');
        setCharter('');
        setOrgId('');
        setTimeout(() => navigate('/projects'), 2000);
      } else {
        setError(`Failed to create project: ${result.error || 'An unknown error occurred.'}`);
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      setError('An unexpected error occurred while creating the project. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box className="create-project-container" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="create-project-container">
      <Paper elevation={3} className="create-project-paper">
        <Typography variant="h1" component="h1" gutterBottom>
          Create New Project
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, mt: 2 }}>
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2, mt: 2 }}>
            {successMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} className="create-project-form" sx={{ mt: successMessage || error ? 1 : 0 /* Adjusted base margin-top */ }}>
          <TextField
            label="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            fullWidth
            required
            type="number"
            inputProps={{ min: "0", step: "0.01" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />

          <TextField
            label="Project Charter"
            value={charter}
            onChange={(e) => setCharter(e.target.value)}
            fullWidth
            multiline
            rows={4}
            required
          />

          <FormControl fullWidth required>
            <InputLabel id="org-id-label">Organization</InputLabel>
            <Select
              labelId="org-id-label"
              id="orgId"
              value={orgId}
              label="Organization"
              onChange={(e) => setOrgId(e.target.value)}
              disabled={organizations.length === 0 || formSubmitting}
            >
              {organizations.length === 0 && !loading && ( // Show only if not loading and no orgs
                <MenuItem value="" disabled>
                  <em>No organizations available</em>
                </MenuItem>
              )}
              {organizations.map((org) => (
                <MenuItem key={org.id} value={org.id.toString()}>
                  {org.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              disabled={formSubmitting}
              sx={{ px: 4 }} // Restored sx prop for specific padding override
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={organizations.length === 0 || formSubmitting || loading}
              startIcon={formSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
              sx={{ px: 4 }} // Restored sx prop for specific padding override
            >
              {formSubmitting ? 'Creating...' : 'Create Project'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateProject;