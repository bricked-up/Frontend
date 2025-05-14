/**
 * AddIssue.tsx
 *
 * This file defines the AddIssue component which provides a form inside a Dialog
 * for creating a new issue or editing an existing issue.
 * It handles form fields like title, description, priority, tag, and cost.
 * Used in the CreateIssue page.
 */

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { Issue, Dependency } from "../../utils/types";
import { useTheme } from "@mui/material/styles";
import { createNewIssue } from "../../utils/post.utils";
import { getProjectIssues } from "../../utils/getters.utils";
import { createDependency } from "../../utils/post.utils";

export interface AddIssueProps {
  show: boolean;
  onClose: () => void;
  boardId: number;
  onAdd: (issue: Issue) => void;
  initialData?: Issue; // optional: if passed = editing
  projectId: number; // Added projectId to fetch issues for dependency dropdown
}

/**
 * AddIssue Component
 *
 * Renders a modal (Dialog) that allows users to create a new issue
 * or edit an existing one. Handles all form input states and submission.
 */
export const AddIssue: React.FC<AddIssueProps> = ({
  show,
  onClose,
  boardId,
  onAdd,
  initialData,
  projectId,
}) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState(1);
  const [issueid, setIssueid] = useState(1);
  const [cost, setCost] = useState(0);
  const [tagid, setTagid] = useState(0);
  const [dependencyId, setDependencyId] = useState<number | null>(null);
  const [projectIssues, setProjectIssues] = useState<Issue[]>([]);
  const [loadingIssues, setLoadingIssues] = useState(false);

  // Use the projectId from props directly instead of maintaining a separate state
  const actualProjectId = projectId || 
    (initialData && initialData.projectId ? initialData.projectId : 
      parseInt(localStorage.getItem("projectid") || "0", 10));

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDesc(initialData.desc || "");
      setPriority(initialData.priority || 1);
      setIssueid(initialData.id || 1);
      setCost(initialData.cost || 0);
      // If we had the dependency data for the issue, we would set it here
    } else {
      setTitle("");
      setDesc("");
      setPriority(1);
      setIssueid(1);
      setCost(0);
      setDependencyId(null);
    }
  }, [initialData]);

  // Fetch project issues for dependency dropdown
  useEffect(() => {
    if (show && typeof actualProjectId === "number" && actualProjectId > 0) {
      const fetchProjectIssues = async () => {
        setLoadingIssues(true);
        try {
          const result = await getProjectIssues(actualProjectId);
          if (result.status === 200 && result.data) {
            // Filter out the current issue if we're editing
            const filteredIssues = initialData 
              ? result.data.filter(issue => issue.id !== initialData.id)
              : result.data;
            setProjectIssues(filteredIssues);
          } else {
            console.error("Failed to fetch project issues:", result.error);
          }
        } catch (error) {
          console.error("Error fetching project issues:", error);
        } finally {
          setLoadingIssues(false);
        }
      };
      
      fetchProjectIssues();
    }
  }, [show, actualProjectId, initialData]);

  /**
   * Handles the form submission.
   * Constructs a Issue object and calls onAdd.
   */
  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("Title is missing :p");
      return;
    }

    const issueParams = {
      title: title,
      desc: desc || null,
      priority,
      cost,
      projectid: Number(actualProjectId),
      tagid,
      assignee: -1,
    };

    // Create the issue first
    const result = await createNewIssue(issueParams, "create-issue");
    // Assuming the correct property is 'issue' instead of 'data', update accordingly.
    // If your Result type uses a different property, replace 'issue' with the correct one.
    const newIssueId = (result as any).data ?? (result as any).issue ?? null;
    if (result.status === 200 || result.status === 201) {
      // If a dependency was selected and we have a new issue ID, create the dependency relationship
      if (dependencyId && newIssueId) {
        try {
          const dependencyResult = await createDependency(newIssueId, dependencyId);
          
          if (dependencyResult.status !== 200 && dependencyResult.status !== 201) {
            console.error("Failed to create dependency relationship:", dependencyResult.error);
            // Continue with closing the dialog even if dependency creation fails
          }
        } catch (error) {
          console.error("Error creating dependency:", error);
          // Continue with closing the dialog even if dependency creation fails
        }
      }
      
      onClose(); // Close the dialog
      window.location.reload();
    } else {
      alert(`Error creating issue: ${result.error || "Unknown error"}`);
      console.error("Create issue failed:", result.error);
    }
  };

  const theme = useTheme();
  const textColor = theme.palette.mode === "light" ? "black" : "white";
  
  return (
    <Dialog open={show} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? "Edit Issue" : "Add New Issue"}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              InputProps={{
                style: { color: textColor },
              }}
              InputLabelProps={{
                style: { color: textColor },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              InputProps={{
                style: { color: textColor },
              }}
              InputLabelProps={{
                style: { color: textColor },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Priority"
              type="number"
              fullWidth
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              InputProps={{
                style: { color: textColor },
              }}
              InputLabelProps={{
                style: { color: textColor },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Tag ID"
              type="number"
              fullWidth
              value={issueid}
              onChange={(e) => setIssueid(Number(e.target.value))}
              InputProps={{
                style: { color: textColor },
              }}
              InputLabelProps={{
                style: { color: textColor },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Cost"
              type="number"
              fullWidth
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
              InputProps={{
                style: { color: textColor },
              }}
              InputLabelProps={{
                style: { color: textColor },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="dependency-select-label" style={{ color: textColor }}>
                Issue Dependency
              </InputLabel>
              <Select
                labelId="dependency-select-label"
                id="dependency-select"
                value={dependencyId || ""}
                onChange={(e) => setDependencyId(e.target.value === "" ? null : Number(e.target.value))}
                label="Issue Dependency"
                style={{ color: textColor }}
                disabled={loadingIssues || projectIssues.length === 0}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {projectIssues.map((issue) => (
                  <MenuItem key={issue.id} value={issue.id}>
                    {issue.title} (ID: {issue.id})
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {typeof actualProjectId === "number" && actualProjectId <= 0 
                  ? "Project ID not set - dependency selection disabled" 
                  : loadingIssues 
                  ? "Loading issues..." 
                  : projectIssues.length === 0 
                  ? "No issues available" 
                  : "Select an issue this depends on"}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          variant="contained"
          color="secondary"
          startIcon={<SaveIcon />}
        >
          {initialData ? "Save Changes" : "Add Issue"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};