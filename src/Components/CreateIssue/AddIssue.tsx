//// AddIssue form component for creating new issues and submitting them

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
import { Task } from "./types";

export interface AddIssueProps {
  show: boolean;
  onClose: () => void;
  boardId: number;
  onAdd: (task: Task) => void;
  initialData?: Task; // optional: if passed = editing
}

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

  // 🛠️ When initialData changes (i.e. user clicked on a card), populate fields
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

  const handleSubmit = () => {
    const newTask: Task = {
      ...(initialData || {}), // <-- reuse ID if editing
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
      completed: initialData?.completed, // preserve completed if editing
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
        <Button onClick={handleSubmit} variant="contained" color="secondary">
          {initialData ? "Save Changes" : "Add Issue"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
