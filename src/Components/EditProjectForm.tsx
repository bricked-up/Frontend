import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Chip,
  Autocomplete,
  Paper,
  Divider,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Close, Save, PersonAdd } from '@mui/icons-material';
import '../css/EditProjectForm.css';


interface TeamMember {
  id: number;
  name: string;
  email: string;
}

interface ProjectData {
  id: number;
  name: string;
  budget: number;
  charter: string;
  teamMembers: TeamMember[];
}

const EditProjectForm: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Automatically update the body attribute when theme changes
  useEffect(() => {
    if (theme.palette.mode === 'dark') {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.setAttribute('data-theme', 'light');
    }
  }, [theme.palette.mode]);

  const [project] = useState<ProjectData>({
    id: 1,
    name: 'Website Redesign',
    budget: 15000,
    charter: 'Redesign company website with modern UI/UX principles and improved performance.',
    teamMembers: [
      { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
      { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
      { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' },
    ],
  });

  const [name, setName] = useState(project.name);
  const [budget, setBudget] = useState<string | number>(project.budget);
  const [charter, setCharter] = useState(project.charter);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(project.teamMembers);
  const [newMemberInput, setNewMemberInput] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const allMembers: TeamMember[] = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' },
    { id: 4, name: 'Diana Prince', email: 'diana@example.com' },
    { id: 5, name: 'Eve Adams', email: 'eve@example.com' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !charter || budget === '') {
      setError('Please fill in all required fields');
      return;
    }

    const budgetValue = typeof budget === 'string' ? parseFloat(budget) : budget;

    if (isNaN(budgetValue)) {
      setError('Budget must be a valid number');
      return;
    }

    setSuccessMessage('Project updated successfully!');
    setError(null);
  };

  const handleAddMember = (member: TeamMember | null) => {
    if (member && !teamMembers.some(m => m.id === member.id)) {
      setTeamMembers([...teamMembers, member]);
      setNewMemberInput('');
    }
  };

  const handleRemoveMember = (memberId: number) => {
    setTeamMembers(teamMembers.filter(member => member.id !== memberId));
  };

  return (
    <Box className="edit-project-container">
      <Paper elevation={3} className="edit-project-paper">
        <Box className="edit-project-header">
          <Typography 
            variant="h6" 
            component="h2" 
            fontWeight="600"
            sx={{ color: theme.palette.mode === 'dark' ? 'white' : 'black' }}
          >
            Edit Project
          </Typography>
          <IconButton onClick={() => navigate(-1)} size="small" aria-label="close">
            <Close fontSize="small" />
          </IconButton>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

        <Box component="form" onSubmit={handleSubmit} className="edit-project-form">
          <TextField
            label="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            InputProps={{
              sx: {
                color: theme.palette.mode === 'dark' ? 'white' : 'black',
                backgroundColor: theme.palette.primary.main,
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
                backgroundColor: theme.palette.primary.main,
              },
            }}
          />

          <TextField
            label="Project Description"
            value={charter}
            onChange={(e) => setCharter(e.target.value)}
            fullWidth
            multiline
            rows={4}
            required
            InputProps={{
              sx: {
                color: theme.palette.mode === 'dark' ? 'white' : 'black',
                backgroundColor: theme.palette.primary.main,
              },
            }}
          />

          <Box className="edit-project-buttons">
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditProjectForm;