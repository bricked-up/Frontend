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
 import { useTheme } from '@mui/material/styles';
 import { useNavigate } from 'react-router-dom';
 import { Close, Save, PersonAdd } from '@mui/icons-material';
 import './EditProjectForm.css';

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
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();

  const inputBg = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)';
  const inputHoverBg = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.06)';
  const textColor = isDark ? theme.palette.text.primary : '#1a1a1a';

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
   { id: 5, name: 'Eve Adams', email: 'eve@example.com' }
  ];

  const updateProject = async (updatedData: ProjectData) => {
   try {
    const response = await fetch(`/api/projects/${project.id}`, { // Replace with your actual API endpoint
     method: 'PUT', // Or 'POST' depending on your API
     headers: {
      'Content-Type': 'application/json',
     },
     body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
     const errorData = await response.json();
     throw new Error(errorData.message || `Failed to update project (status ${response.status})`);
    }

    const responseData = await response.json();
    console.log('Project updated on server:', responseData);
    setSuccessMessage('Project updated successfully!');
    setError(null);
    // Optionally, navigate away or perform other actions on success
   } catch (error: any) {
    console.error('Error updating project:', error);
    setError(error.message || 'Failed to update project');
    setSuccessMessage(null);
   }
  };

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

   const updatedProjectData = {
    id: project.id,
    name,
    budget: budgetValue,
    charter,
    teamMembers,
   };

   console.log('Updated project data to send:', updatedProjectData);
   updateProject(updatedProjectData); // Call the API update function
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
      <Typography variant="h6" component="h2" fontWeight="600" sx={{ color: textColor }}>
       Edit Project
      </Typography>
      <IconButton onClick={() => navigate(-1)} size="small" aria-label="close">
       <Close fontSize="small" />
      </IconButton>
     </Box>

     <Divider sx={{ my: 1.5 }} />

     {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
     {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

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
         backgroundColor: inputBg,
         color: textColor,
         '&:hover': { backgroundColor: inputHoverBg }
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
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
        sx: {
         backgroundColor: inputBg,
         color: textColor,
         '&:hover': { backgroundColor: inputHoverBg }
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
         backgroundColor: inputBg,
         color: textColor,
         '&:hover': { backgroundColor: inputHoverBg }
        }
       }}
      />

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: textColor }}>
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
           backgroundColor: inputBg,
           color: textColor,
           '&:hover': { backgroundColor: inputHoverBg }
          }
         }}
        />
       )}
       PaperComponent={(props) => (
        <Paper {...props} sx={{ backgroundColor: theme.palette.background.paper }} />
       )}
       sx={{ mb: 1.5 }}
      />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
       {teamMembers.length > 0 ? (
        teamMembers.map((member) => (
         <Chip
          key={member.id}
          label={member.name}
          onDelete={() => handleRemoveMember(member.id)}
          size="small"
          sx={{
           backgroundColor: theme.palette.primary.dark,
           color: theme.palette.primary.contrastText,
           '& .MuiChip-deleteIcon': {
            color: theme.palette.primary.contrastText,
            fontSize: '1rem'
           }
          }}
         />
        ))
       ) : (
        <Typography variant="caption" sx={{ color: textColor }}>
         No team members added
        </Typography>
       )}
      </Box>

      <Divider sx={{ my: 1.5 }} />

      <Box
       sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 2,
        pt: 2,
        mt: 2,
        borderTop: `1px solid ${theme.palette.divider}`
       }}
      >
       <Button
        variant="outlined"
        onClick={() => navigate(-1)}
        size="medium"
        startIcon={<Close />}
        sx={{
         textTransform: 'none',
         minWidth: 100,
         borderRadius: 2,
         px: 2,
         fontWeight: 500
        }}
       >
        Cancel
       </Button>
       <Button
        type="submit"
        variant="contained"
        color="primary"
        size="medium"
        startIcon={<Save />}
        sx={{
         textTransform: 'none',
         minWidth: 100,
         borderRadius: 2,
         px: 2,
         fontWeight: 500
        }}
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