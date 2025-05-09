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
  Divider,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../css/CreateProject.css';

type Organization = {
  id: number;
  name: string;
};

/**
 * CreateProject component for creating new projects
 * @component
 * @returns {JSX.Element} Create project form
 */
const CreateProject: React.FC = () => {
  const [name, setName] = useState('');
  const [budget, setBudget] = useState<string>('');
  const [charter, setCharter] = useState('');
  const [orgId, setOrgId] = useState<string>('');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Mock function to fetch user's organizations
  useEffect(() => {
    const fetchUserOrganizations = async () => {
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch(`/api/users/${userId}/organizations`);
        // const data = await response.json();
        
        // Mock response
        const mockOrganizations = [
          { id: 1, name: 'Tech Innovators' },
          { id: 2, name: 'Design Studio' },
          { id: 3, name: 'Marketing Pros' }
        ];
        
        setOrganizations(mockOrganizations);
        setLoading(false);
      } catch (err) {
        setError('Failed to load organizations');
        setLoading(false);
      }
    };

    fetchUserOrganizations();
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validation
    if (!name || !budget || !charter || !orgId) {
      setError('Please fill in all required fields');
      setSuccessMessage(null);
      return;
    }

    const budgetValue = parseFloat(budget);
    if (isNaN(budgetValue) || budgetValue <= 0) {
      setError('Please enter a valid budget amount (must be positive)');
      return;
    }

    const projectData = {
      name,
      budget: budgetValue,
      charter,
      organization_id: Number(orgId)
    };

    // Mock API call
    console.log('Creating project:', projectData);
    setSuccessMessage('Project created successfully!');
    setError(null);
    
    setTimeout(() => navigate('/projects'), 1500);
  };

  if (loading) {
    return (
      <Box className="create-project-container">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="create-project-container">
      <Paper elevation={3} className="create-project-paper">
        <Typography variant="h5" component="h1" gutterBottom>
          Create New Project
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            required
            sx={{ mb: 2 }}
          />

          <TextField
            label="Budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            fullWidth
            margin="normal"
            required
            type="number"
            inputProps={{ min: 0, step: 0.01 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              )
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Project Charter"
            value={charter}
            onChange={(e) => setCharter(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            required
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth margin="normal" required sx={{ mb: 3 }}>
            <InputLabel id="org-id-label">Organization</InputLabel>
            <Select
              labelId="org-id-label"
              id="orgId"
              value={orgId}
              label="Organization"
              onChange={(e) => setOrgId(e.target.value)}
              disabled={organizations.length === 0}
            >
              {organizations.map((org) => (
                <MenuItem key={org.id} value={org.id.toString()}>
                  {org.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{ px: 4 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ px: 4 }}
              disabled={organizations.length === 0}
            >
              Create Project
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateProject;