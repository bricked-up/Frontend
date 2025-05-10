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
  InputAdornment,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import '../css/CreateProject.css';
import { createProject, NewProjectParams } from '../utils/post.utils';

type Organization = {
  id: number;
  name: string;
};

const CreateProject: React.FC = () => {
  const theme = useTheme();
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

  // Automatically update the body attribute when theme changes
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
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockOrganizations = [
          { id: 1, name: 'Tech Innovators Inc.' },
          { id: 2, name: 'Design Studio Co.' },
          { id: 3, name: 'Marketing Professionals LLC' }
        ];
        setOrganizations(mockOrganizations);
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
      tag: '',
      budget: budgetValue,
      charter: charter.trim(),
      archived: false,
      members: [],
      issues: []
    };

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccessMessage('Project created successfully! Redirecting...');
      setTimeout(() => navigate('/viewProject'), 2000);
    } catch (error: any) {
      console.error('Submission error:', error);
      setError('An unexpected error occurred while creating the project. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
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
        <Box className="create-project-header">
          <Typography 
            variant="h6" 
            component="h2" 
            fontWeight="600"
            sx={{ color: theme.palette.mode === 'dark' ? 'white' : 'black' }}
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
            InputProps={{
              sx: {
                color: theme.palette.mode === 'dark' ? 'white' : 'black',
                backgroundColor: theme.palette.background.default,
                borderColor: theme.palette.mode === 'light' ? '#ccc' : 'transparent',
                borderStyle: 'solid',
                borderWidth: '1px',
              },
            }}
          />

          <TextField
            label="Budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            fullWidth
            required
            type="number"
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
              sx: {
                color: theme.palette.mode === 'dark' ? 'white' : 'black',
                backgroundColor: theme.palette.background.default,
                borderColor: theme.palette.mode === 'light' ? '#ccc' : 'transparent',
                borderStyle: 'solid',
                borderWidth: '1px',
              },
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
            InputProps={{
              sx: {
                color: theme.palette.mode === 'dark' ? 'white' : 'black',
                backgroundColor: theme.palette.background.default,
                borderColor: theme.palette.mode === 'light' ? '#ccc' : 'transparent',
                borderStyle: 'solid',
                borderWidth: '1px',
              },
            }}
          />

          <Box className="create-project-buttons">
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Create Project
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateProject;