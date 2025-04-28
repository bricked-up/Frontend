import React, { useState, useEffect } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Alert, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Project, User } from '../utils/types'; 
import styles from './EditProjectForm.module.css'; 

interface EditProjectFormProps {
    //  You might want to pass the current user's ID or role here,
    //  to check if they are allowed to edit the project.
 }

 const EditProjectForm: React.FC<EditProjectFormProps> = () => {
     const { projectId } = useParams<{ projectId: string }>(); // Get projectId from URL
     const navigate = useNavigate();

     const [project, setProject] = useState<Project | null>(null);
     const [name, setName] = useState('');
     const [charter, setCharter] = useState('');
     const [budget, setBudget] = useState<number | ''>('');
     const [members, setMembers] = useState<string[]>([]); // Array of user IDs
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);
     const [availableUsers, setAvailableUsers] = useState<User[]>([]); //mock

     useEffect(() => {
         const fetchProjectData = async () => {
             if (!projectId) {
                 setError('Project ID is missing.');
                 setLoading(false);
                 return;
             }

             try {
                 // Fetch project data from the backend
                 const response = await fetch(`/projects/${projectId}`); //  API endpoint
                 if (!response.ok) {
                     throw new Error(`Failed to fetch project: ${response.status}`);
                 }
                 const data: Project = await response.json();
                 setProject(data);
                 setName(data.name);
                 setCharter(data.charter);
                 setBudget(data.budget);
                 setMembers(data.members || []); // Ensure members is always an array

                 //mock users
                 setAvailableUsers([
                    {email: 'user1@example.com', displayName: 'User One', password: '', verified: true},
                    {email: 'user2@example.com', displayName: 'User Two', password: '', verified: true},
                    {email: 'user3@example.com', displayName: 'User Three', password: '', verified: true}
                 ])

             } catch (err: any) {
                 setError(err.message);
             } finally {
                 setLoading(false);
             }
         };

         fetchProjectData();
     }, [projectId]);

     const handleMemberChange = (event: React.ChangeEvent<{ value: string[] }>) => {
        setMembers(event.target.value);
      };

     const handleSubmit = async (event: React.FormEvent) => {
         event.preventDefault();

         if (!project) return; // Should not happen, but for type safety

         const updatedProjectData = {
             ...project,
             name,
             charter,
             budget: parseFloat(budget.toString()),
             members,
         };

         try {
             setLoading(true);
             setError(null);
             // Send the updated data to the backend
             const response = await fetch(`/projects/${projectId}`, { //  API endpoint
                 method: 'PATCH',
                 headers: {
                     'Content-Type': 'application/json',
                 },
                 body: JSON.stringify(updatedProjectData),
             });

             if (!response.ok) {
                 throw new Error('Failed to update project');
             }

             // Optionally, handle the response data (e.g., show a success message)
             console.log('Project updated successfully');
             navigate(`/projects/${projectId}`); // Go to project details page

         } catch (err: any) {
             setError(err.message);
         } finally {
             setLoading(false);
         }
     };

     if (loading) {
         return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
              <CircularProgress />
            </div>
          );
     }

     if (error) {
         return <Alert severity="error">{error}</Alert>;
     }

     if (!project) {
         return <Alert severity="warning">Project not found.</Alert>; // Or a loading state
     }

     return (
         <div className={styles.editProjectContainer}>
             <h2>Edit Project</h2>
             <form onSubmit={handleSubmit} className={styles.editProjectForm}>
                 <TextField
                     label="Project Name"
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     fullWidth
                     margin="normal"
                     required
                 />
                 <TextField
                     label="Charter"
                     value={charter}
                     onChange={(e) => setCharter(e.target.value)}
                     fullWidth
                     margin="normal"
                     multiline
                     rows={4}
                     required
                 />
                 <TextField
                     label="Budget"
                     value={budget}
                     onChange={(e) => {
                         const value = e.target.value;
                         if (value === '' || /^\d*\.?\d*$/.test(value)) {
                             setBudget(value === '' ? '' : parseFloat(value));
                         }
                     }}
                     fullWidth
                     margin="normal"
                     type="number"
                     required
                 />

                <FormControl fullWidth margin="normal">
                    <InputLabel id="members-label">Members</InputLabel>
                    <Select
                        labelId="members-label"
                        id="members"
                        multiple
                        value={members}
                        onChange={handleMemberChange}
                        renderValue={(selected) => {
                            const selectedUsers = availableUsers.filter(user => selected.includes(user.email));
                            return selectedUsers.map(user => user.displayName).join(', ');
                        }}
                    >
                        {availableUsers.map((user) => (
                            <MenuItem key={user.email} value={user.email}>
                                {user.displayName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                 <Button type="submit" variant="contained" color="primary" disabled={loading}>
                     {loading ? 'Saving...' : 'Save Changes'}
                 </Button>
             </form>
         </div>
     );
 };

 export default EditProjectForm;
