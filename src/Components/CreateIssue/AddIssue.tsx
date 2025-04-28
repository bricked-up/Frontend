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
import { Task } from "../../utils/types";

export interface AddIssueProps {
  show: boolean;
  onClose: () => void;
  boardId: number;
  onAdd: (task: Task) => void;
  initialData?: Task; // optional: if passed = editing
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
  const [tagid, setTagid] = useState(1);
  const [cost, setCost] = useState(0);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDesc(initialData.desc || "");
      setPriority(initialData.priority || 1);
      setTagid(initialData.tagid || 1);
      setCost(initialData.cost || 0);
    } else {
      setTitle("");
      setDesc("");
      setPriority(1);
      setTagid(1);
      setCost(0);
    }
  }, [initialData]);

  /**
   * Handles the form submission.
   * Constructs a Task object and calls onAdd.
   */
  const handleSubmit = () => {
    if (!title.trim()) {
      alert("Title is missing :p");
      return;
    }
    const newTask: Task = {
      ...(initialData || {}),
      id: initialData
        ? initialData.id
        : Math.random().toString(36).substr(2, 9),
      title,
      desc,
      tagid,
      priority,
      cost,
      created: initialData?.created || new Date(),
      createdBy: initialData?.createdBy || "You",
      completed: initialData?.completed,
    };

    onAdd(newTask);
    onClose();
  };

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
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Priority"
              type="number"
              fullWidth
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Tag ID"
              type="number"
              fullWidth
              value={tagid}
              onChange={(e) => setTagid(Number(e.target.value))}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Cost"
              type="number"
              fullWidth
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
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
