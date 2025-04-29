// CreateOrganization.tsx
import { Paper, useTheme } from "@mui/material";

import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardActions,
    Typography,
    TextField,
    Grid,
    IconButton,
} from "@mui/material";
import { createOrganization, getAllOrganizations } from "./Organizations";
import { Organization } from "./Organization";

const CreateOrganization: React.FC = () => {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [orgName, setOrgName] = useState("");
    const [ownerName, setOwnerName] = useState("");

    useEffect(() => {
        const orgs = getAllOrganizations();
        setOrganizations(orgs);
    }, []);

    const handleCreate = () => {
        if (!orgName || !ownerName) return;
        const newOrg = createOrganization(orgName, ownerName);
        setOrganizations((prev) => [...prev, newOrg]);
        setOrgName("");
        setOwnerName("");
    };


    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" textAlign="center" gutterBottom>
                Organization Manager
            </Typography>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", marginBottom: 4 }}>
                <TextField
                    label="Organization Name"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    variant="outlined"
                />
                <TextField
                    label="Owner Name"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    variant="outlined"
                />
                <Button variant="contained" color="secondary" onClick={handleCreate}>
                    Create
                </Button>
            </Box>


        </Box>
    );
};

export default CreateOrganization;