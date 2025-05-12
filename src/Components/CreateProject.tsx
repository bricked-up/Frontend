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
import { createProject, NewProjectParams } from '../utils/post.utils';

type Organization = {
  id: number;
  name: string;
};

const CreateProject: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [budget, setBudget] = useState<string>('');
  const [charter, setCharter] = useState('');
  const [orgId, setOrgId] = useState<string>('');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme.palette.mode === 'dark' ? 'dark' : 'light');
  }, [theme.palette.mode]);

  useEffect(() => {
    const fetchUserOrganizations = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
        const mockOrganizations: Organization[] = [
          { id: 1, name: 'Tech Innovators Inc.' },
          { id: 2, name: 'Design Studio Co.' },
          { id: 3, name: 'Marketing Professionals LLC' },
        ];
        setOrganizations(mockOrganizations);
        if (mockOrganizations.length > 0) {
          setOrgId(String(mockOrganizations[0].id));
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
      tag: '',
      budget: budgetValue,
      charter: charter.trim(),
      archived: false,
    };

    const status = await createProject(newProjectParams, 'create-proj');

    if (status === 201 || status === 200) {
      setName('');
      setBudget('');
      setCharter('');
      setOrgId('');
      navigate('/viewProject');
    } else {
      navigate("/500");
    }

    setFormSubmitting(false);
  };

  if (loading && organizations.length === 0) {
    return (
      <Box
        className="create-project-container"
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading organization data...</Typography>
      </Box>
    );
  }

  const inputTextColorSx = {
    input: {
      color: theme.palette.mode === 'dark' ? '#fff' : 'inherit',
    },
    textarea: {
      color: theme.palette.mode === 'dark' ? '#fff' : 'inherit',
    },
    '.MuiSelect-select': {
      color: theme.palette.mode === 'dark' ? '#fff' : 'inherit',
    },
    '& label': {
      color: theme.palette.text.secondary,
    },
  };

  return (
    <Box className="create-project-container">
      <Paper elevation={3} className="create-project-paper">
        <Box className="create-project-header">
          <Typography variant="h6" component="h2" fontWeight="600" sx={{ color: theme.palette.text.primary }}>
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
            sx={inputTextColorSx}
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
            sx={inputTextColorSx}
          />

          <TextField
            select
            label="Organization"
            value={orgId}
            onChange={(e) => setOrgId(e.target.value)}
            fullWidth
            required
            disabled={formSubmitting || loading || organizations.length === 0}
            sx={inputTextColorSx}
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
            sx={inputTextColorSx}
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