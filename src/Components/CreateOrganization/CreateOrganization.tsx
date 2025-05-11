/* src/utils/localStorage/Organizations.ts */
// src/utils/fetchers.ts

import { API_BASE } from "../../../src/config";
import { Link as RouterLink } from "react-router-dom";
import { Project, OrgMember, OrgRole, Organization, User } from "../../../src/utils/types";
import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Typography,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Grid,
    Tab,
    ListItemButton,
} from "@mui/material";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useTheme } from "@mui/material/styles";

import OrganizationCard from "./OrganizationCard";
import { tokens } from "../../theme";
import { createOrganization as CreateOrg, /*updateOrg*/ } from "../../utils/post.utils";
import { getAllUsers, fetchAllOrgsForUser, getUser, getOrg } from "../../utils/getters.utils";

const sessionUserId = localStorage.getItem("userid"); // assuming you saved this at login



const STORAGE_KEY = "organizations";

/**
 * Load and rehydrate all stored organizations from localStorage.
 * @returns {Organization[]}
 */
function loadOrgs(): Organization[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        return parsed.map((o: any) => ({
            id: o.id,
            name: o.name,
            projects: Array.isArray(o.projects) ? o.projects : [],
            members: Array.isArray(o.members) ? o.members : [],
            roles: Array.isArray(o.roles) ? o.roles : [],
        }));
    } catch {
        return [];
    }
}

/**
 * Serialize and save the given organizations array to localStorage.
 * @param {Organization[]} orgs
 */
function saveOrgs(orgs: Organization[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orgs));
}

/**
 * Retrieve all stored organizations.
 * @returns {Organization[]}
 */


/**
 * Create a new organization and persist it.
 * @param {string} name
 * @param {Project[]} projects
 * @param {OrgMember[]} members
 * @param {OrgRole[]} roles
 * @returns {Organization}
 */
export function createOrganization(
    name: string,
    projects: Project[],
    members: OrgMember[],
    roles: OrgRole[]
): Organization {
    const orgs = loadOrgs();
    const newOrg: Organization = {
        id: Date.now(),
        name,
        projects,
        members,
        roles,
    };
    saveOrgs([...orgs, newOrg]);
    return newOrg;
}

/**
 * Update an existing organization identified by its ID.
 * @param {number} id
 * @param {Partial<Omit<Organization, "id">>} updates
 * @returns {Organization}
 */
export function updateOrganization(
    id: number,
    updates: Partial<Omit<Organization, "id">>
): Organization {
    const orgs = loadOrgs();
    const idx = orgs.findIndex(o => o.id === id);
    if (idx === -1) throw new Error("Organization not found");
    const updatedOrg = { ...orgs[idx], ...updates };
    orgs[idx] = updatedOrg;
    saveOrgs(orgs);
    return updatedOrg;
}

/**
 * Delete an organization by its ID.
 * @param {number} id
 */
export function deleteOrganization(id: number): void {
    const orgs = loadOrgs().filter(o => o.id !== id);
    saveOrgs(orgs);
}


/* src/components/organizations/CreateOrganization.tsx */



const CreateOrganization: React.FC = () => {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
    const [orgName, setOrgName] = useState("");
    const [members, setMembers] = useState<string[]>([]);
    const [newMember, setNewMember] = useState("");
    const [projects, setProjects] = useState<string[]>([]);
    const [newProject, setNewProject] = useState("");

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);


    const userId = sessionUserId ? parseInt(sessionUserId, 10) : -1;

    const [user, setUser] = useState<User | null>(null);


    useEffect(() => {
        const sessionUserId = localStorage.getItem("userid");
        const userId = sessionUserId ? parseInt(sessionUserId, 10) : -1;

        if (userId <= 0) return;

        (async () => {
            const orgs = await fetchAllOrgsForUser(userId);
            console.log("🛰️ Loaded orgs:", orgs);
            setOrganizations(orgs);
        })();
    }, []);

    const handleSubmit = async () => {
        if (!orgName.trim()) return alert("Please enter an organization name");

        const orgMembers: OrgMember[] = members.map((_, i) => ({
            id: i + 1,
            userId: i + 1,
            orgId: editingOrg?.id ?? 0,
            roles: [],
        }));

        const orgProjects: Project[] = projects.map((name, i) => ({
            id: i + 1,
            name,
            orgId: editingOrg?.id ?? 0,
            budget: 0,
            charter: "",
            archived: false,
            members: [],
            issues: [],
            tags: [],
        }));

        const orgRoles: OrgRole[] = [];
        const numericProjectIds = projects.map(p =>
            parseInt(p.replace(/\D+/g, ""), 10)
        ).filter(id => !isNaN(id));
        const result = await CreateOrg(
            {
                orgName: orgName,
                projects: numericProjectIds, // now an array of numbers/IDs
            },
            "create-org"
        );
        window.location.reload();

    };



    // src/components/organizations/CreateOrganization.tsx
    const openDialog = (org?: Organization) => {
        if (org) {
            setEditingOrg(org);
            setOrgName(org.name);

            // Cast to any[] so TS lets us handle both numbers and objects
            const rawMembers = (org.members ?? []) as any[];
            setMembers(
                rawMembers.map(m =>
                    // if it's a number, use it directly; otherwise read userId
                    typeof m === "number" ? `User ${m}` : `User ${m.userId}`
                )
            );

            const rawProjects = (org.projects ?? []) as any[];
            setProjects(
                rawProjects.map(p =>
                    typeof p === "number" ? `Project ${p}` : `Project ${p.id}`
                )
            );
        }
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setEditingOrg(null);
        setOrgName("");
        setMembers([]);
        setNewMember("");
        setProjects([]);
        setNewProject("");
        setDialogOpen(false);
    };

    const handleAddMember = () => {
        const name = newMember.trim();
        if (!name) return alert("Please enter a member name");
        setMembers(prev => [...prev, name]);
        setNewMember("");
    };

    const handleRemoveMember = (idx: number) =>
        setMembers(prev => prev.filter((_, i) => i !== idx));

    const handleAddProject = () => {
        const title = newProject.trim();
        if (!title) return alert("Please enter a project name");
        setProjects(prev => [...prev, title]);
        setNewProject("");
    };

    const handleRemoveProject = (idx: number) =>
        setProjects(prev => prev.filter((_, i) => i !== idx));


    const handleDelete = (id: number) => {
        deleteOrganization(id);
        setOrganizations(prev => prev.filter(o => o.id !== id));
    };

    return (
        <>
            <Box sx={{ p: 3 }}>
                <Tab
                    icon={<AssignmentIcon />}
                    iconPosition="start"
                    label="Organizations"
                    sx={{
                        color:
                            theme.palette.mode === "dark"
                                ? colors.greenAccent[400]
                                : colors.blueAccent[600],
                    }}
                />

                <Grid container spacing={4}>
                    {organizations.map(org => (
                        <Grid item xs={12} sm={6} md={4} key={org.id}>
                            <OrganizationCard
                                organization={org}
                                onEdit={openDialog}
                                onDelete={handleDelete}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Box sx={{ position: "fixed", bottom: 24, right: 24, boxShadow: 3 }}>
                <Button
                    startIcon={<AddCircleOutline />}
                    variant="contained"
                    color="secondary"
                    onClick={() => openDialog()}
                >
                    New Organization
                </Button>
            </Box>

            <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
                <DialogTitle sx={{ color: theme.palette.mode === "dark" ? "#E0E0E0" : "#141414" }}>
                    {editingOrg ? "Edit Organization" : "New Organization"}
                </DialogTitle>
                <DialogContent dividers>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Name"
                        value={orgName}
                        onChange={e => setOrgName(e.target.value)}
                        sx={{ input: { color: theme.palette.mode === "dark" ? "#E0E0E0" : "#141414" } }}
                    />

                    <Typography variant="h6" sx={{ mt: 2, color: theme.palette.mode === "dark" ? "#E0E0E0" : "#141414" }}>Team Members</Typography>
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 1 }}>
                        <TextField
                            label="Add member"
                            value={newMember}
                            onChange={e => setNewMember(e.target.value)}
                            sx={{ input: { color: theme.palette.mode === "dark" ? "#E0E0E0" : "#141414" } }}
                        />
                        <IconButton onClick={handleAddMember}><AddIcon /></IconButton>
                    </Box>
                    <List>
                        {members.map((m, i) => {
                            const memberName = m;

                            return (
                                <ListItem
                                    key={i}
                                    secondaryAction={
                                        <IconButton onClick={() => handleRemoveMember(i)}>
                                            <RemoveIcon />
                                        </IconButton>
                                    }

                                >
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        sx={{
                                            justifyContent: "flex-start",
                                            textTransform: "none",
                                            borderRadius: 2,
                                            my: 0.5,
                                            py: 1.5,
                                            boxShadow: 3,
                                            "&:hover": {
                                                boxShadow: 6,
                                                backgroundColor: "primary.dark",
                                            },
                                        }}
                                    >
                                        {memberName}
                                    </Button>
                                </ListItem>
                            );
                        })}
                    </List>


                    <Typography variant="h6" sx={{ mt: 2, color: theme.palette.mode === "dark" ? "#E0E0E0" : "#141414" }}>Projects</Typography>
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 1 }}>
                        <TextField
                            label="Add project"
                            value={newProject}
                            onChange={e => setNewProject(e.target.value)}
                            sx={{ input: { color: theme.palette.mode === "dark" ? "#E0E0E0" : "#141414" } }}
                        />
                        <IconButton onClick={handleAddProject}><AddIcon /></IconButton>
                    </Box>
                    <List>
                        {projects.map((p, i) => {
                            // if you have real Project objects, use p.id and p.name
                            // here p is just a string, so we’ll parse out the number as an example:
                            const projectId = parseInt(p.replace(/\D+/g, ""), 10) || i + 1;
                            const projectName = p;

                            return (
                                <ListItem
                                    key={i}
                                    secondaryAction={
                                        <IconButton onClick={() => handleRemoveProject(i)}>
                                            <RemoveIcon />
                                        </IconButton>
                                    }
                                >
                                    <Button
                                        component={RouterLink}
                                        to={`/project/${encodeURIComponent(projectName)}`}
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        sx={{
                                            justifyContent: "flex-start",
                                            textTransform: "none",
                                            borderRadius: 2,
                                            my: 0.5,
                                            py: 1.5,
                                            boxShadow: 3,
                                            "&:hover": {
                                                boxShadow: 6,
                                                backgroundColor: "primary.dark",
                                            },
                                        }}
                                    >
                                        {projectName}
                                    </Button>
                                </ListItem>
                            );
                        })}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="secondary">
                        {editingOrg ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CreateOrganization;