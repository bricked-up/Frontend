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
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { Issue } from "../../utils/types";
import { useTheme } from "@mui/material/styles";
import { createNewIssue } from "../../utils/post.utils";

export interface AddIssueProps {
  show: boolean;
  onClose: () => void;
  boardId: number;
  onAdd: (issue: Issue) => void;
  initialData?: Issue; // optional: if passed = editing
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
}) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState(1);
  const [issueid, setIssueid] = useState(1);
  const [cost, setCost] = useState(0);
  const [projectid, setProjectid] = useState(0);
  const [tagid, setTagid] = useState(0);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDesc(initialData.desc || "");
      setPriority(initialData.priority || 1);
      setIssueid(initialData.id || 1);
      setCost(initialData.cost || 0);
    } else {
      setTitle("");
      setDesc("");
      setPriority(1);
      setIssueid(1);
      setCost(0);
    }
  }, [initialData]);

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
      projectid,
      tagid,
      assignee: -1,
    };

    const result = await createNewIssue(issueParams, "create-issue");
    if (result.status === 200 || result.status === 201) {
      onClose(); // Close the dialog
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