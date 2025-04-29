// EditProjectForm.tsx
import React, { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { Close, Save, PersonAdd } from '@mui/icons-material';
import './EditProjectForm.css';

/**
 * @typedef {Object} TeamMember
 * @property {number} id - Unique identifier for the team member
 * @property {string} name - Full name of the team member
 * @property {string} email - Email address of the team member
 */
interface TeamMember {
  id: number;
  name: string;
  email: string;
}

/**
 * @typedef {Object} ProjectData
 * @property {number} id - Unique identifier for the project
 * @property {string} name - Name of the project
 * @property {number} budget - Project budget in dollars
 * @property {string} charter - Project description/charter
 * @property {TeamMember[]} teamMembers - Array of team members assigned to the project
 */
interface ProjectData {
  id: number;
  name: string;
  budget: number;
  charter: string;
  teamMembers: TeamMember[];
}

/**
 * EditProjectForm component for modifying project details
 * @component
 * @param {Object} props - Component props
 * @returns {JSX.Element} The rendered EditProjectForm component
 *
 * @example
 * return <EditProjectForm />
 */
const EditProjectForm: React.FC = () => {
  const navigate = useNavigate();
  
  /**
   * Current project data state
   * @type {[ProjectData, Function]}
   */
  const [project] = useState<ProjectData>({
    id: 1,
    name: 'Website Redesign',
    budget: 15000,
    charter: 'Redesign company website with modern UI/UX principles and improved performance.',
    teamMembers: [
      { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
      { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
      { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' }
    ]
  });

  // Form state
  const [name, setName] = useState(project.name);
  const [budget, setBudget] = useState<string | number>(project.budget);
  const [charter, setCharter] = useState(project.charter);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(project.teamMembers);
  const [newMemberInput, setNewMemberInput] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Mock list of all available team members in the organization
   * @type {TeamMember[]}
   */
  const allMembers: TeamMember[] = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' },
    { id: 4, name: 'Diana Prince', email: 'diana@example.com' },
    { id: 5, name: 'Eve Adams', email: 'eve@example.com' }
  ];

  /**
   * Handles form submission
   * @param {React.FormEvent} e - Form event
   * @returns {void}
   */
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

    console.log('Updated project:', { name, budget: budgetValue, charter, teamMembers });
    setSuccessMessage('Project updated successfully!');
    setError(null);
  };

  /**
   * Adds a new team member to the project
   * @param {TeamMember | null} member - Team member to add
   * @returns {void}
   */
  const handleAddMember = (member: TeamMember | null) => {
    if (member && !teamMembers.some(m => m.id === member.id)) {
      setTeamMembers([...teamMembers, member]);
      setNewMemberInput('');
    }
  };

  /**
   * Removes a team member from the project
   * @param {number} memberId - ID of the member to remove
   * @returns {void}
   */
  const handleRemoveMember = (memberId: number) => {
    setTeamMembers(teamMembers.filter(member => member.id !== memberId));
  };

  return (
    <Box className="edit-project-container">
      <Paper elevation={3} className="edit-project-paper">
        <Box className="edit-project-header">
          <Typography variant="h6" component="h2" fontWeight="600">
            Edit Project
          </Typography>
          <IconButton 
            onClick={() => navigate(-1)}
            size="small"
            aria-label="close"
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        {error && <Alert severity="error" sx={{ mb: 2, py: 0.5 }}>{error}</Alert>}
        {successMessage && <Alert severity="success" sx={{ mb: 2, py: 0.5 }}>{successMessage}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            label="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            size="small"
            margin="dense"
            required
            sx={{ mb: 1.5 }}
            InputProps={{
              sx: { 
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.12)'
                }
              }
            }}
          />

          <TextField
            label="Budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            fullWidth
            size="small"
            margin="dense"
            required
            type="number"
            sx={{ mb: 1.5 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
              sx: { 
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.12)'
                }
              }
            }}
          />

          <TextField
            label="Project Description"
            value={charter}
            onChange={(e) => setCharter(e.target.value)}
            fullWidth
            size="small"
            margin="dense"
            multiline
            rows={3}
            required
            sx={{ mb: 1.5 }}
            InputProps={{
              sx: { 
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.12)'
                }
              }
            }}
          />

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" gutterBottom sx={{ mb: 1, fontWeight: 500 }}>
            Team Members
          </Typography>

          <Autocomplete
            options={allMembers.filter(member => !teamMembers.some(m => m.id === member.id))}
            getOptionLabel={(option) => `${option.name} <${option.email}>`}
            value={null}
            onChange={(_, value) => handleAddMember(value)}
            inputValue={newMemberInput}
            onInputChange={(_, newInputValue) => setNewMemberInput(newInputValue)}
            size="small"
            renderInput={(params) => (
              <TextField
                {...params}
                label="Add team member"
                variant="outlined"
                fullWidth
                margin="dense"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <InputAdornment position="start">
                        <PersonAdd fontSize="small" />
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                  sx: { 
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.12)'
                    }
                  }
                }}
              />
            )}
            PaperComponent={(props) => (
              <Paper {...props} sx={{ backgroundColor: 'background.paper' }} />
            )}
            sx={{ mb: 1.5 }}
          />

          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 1, 
            mb: 1.5,
            minHeight: 32
          }}>
            {teamMembers.length > 0 ? (
              teamMembers.map((member) => (
                <Chip
                  key={member.id}
                  label={member.name}
                  onDelete={() => handleRemoveMember(member.id)}
                  size="small"
                  sx={{ 
                    backgroundColor: 'primary.dark',
                    color: 'primary.contrastText',
                    '& .MuiChip-deleteIcon': {
                      color: 'primary.contrastText',
                      fontSize: '1rem'
                    }
                  }}
                />
              ))
            ) : (
              <Typography variant="caption" color="text.secondary">
                No team members added
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 1.5 }} />

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: 1.5,
            pt: 1
          }}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              size="small"
              startIcon={<Close fontSize="small" />}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="small"
              startIcon={<Save fontSize="small" />}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditProjectForm;