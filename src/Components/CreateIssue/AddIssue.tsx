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
import { Issue, Member } from "../../utils/types";
import { useTheme } from "@mui/material/styles";
import DropDown from "../DropDown"; // import dropdown for assignees

export interface AddIssueProps {
  show: boolean;
  onClose: () => void;
  boardId: number;
  onAdd: (issue: Issue) => void; // renamed Task->Issue
  initialData?: Issue; // renamed Task->Issue
  members: Member[]; // new prop for project members
}

/**
 * AddIssue Component
 *
 * Renders a modal (Dialog) that allows users to create a new issue
 * or edit an existing issue. Handles all form input states and submission.
 */
export const AddIssue: React.FC<AddIssueProps> = ({
  show,
  onClose,
  boardId,
  onAdd,
  initialData,
  members, // destructure members
}) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState<string | null>(""); // issue.desc is optional
  const [priority, setPriority] = useState<number | null>(1);
  const [tagId, setTagId] = useState<number | null>(1); // renamed tagid->tagId
  const [cost, setCost] = useState(0);
  
  // new state: selected assignee ID
  const [assignedToId, setAssignedToId] = useState<number | undefined>(
    initialData?.assignedToId
  );

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDesc(initialData.desc ?? "");
      setPriority(initialData.priority ?? 1);
      setTagId(initialData.tagId ?? 1);
      setCost(initialData.cost);
      // sync existing assignee on edit
      setAssignedToId(initialData.assignedToId ?? undefined);
    } else {
      setTitle("");
      setDesc("");
      setPriority(1);
      setTagId(1);
      setCost(0);
      // clear assignee on new
      setAssignedToId(undefined);
    }
  }, [initialData]);

  /**
   * Handles the form submission.
   * Constructs an Issue object and calls onAdd.
   */
  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("Title is missing :p");
      return;
    }
    const newIssue: Issue = {
      ...(initialData || {}),
      id: initialData ? initialData.id : Date.now(), // generate a numeric ID if none
      title,
      desc: desc || null,
      tagId,
      priority,
      cost,
      created: initialData?.created || new Date(),
      completed: initialData?.completed ?? null,
      // include assignment fields
      assignedToId,
      assignedToName,
    };

    onAdd(newIssue);
    onClose();
  };

  const assignedToName = members.find(m => m.id === assignedToId)?.name;
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
              value={desc ?? ""}
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
              value={priority ?? 1}
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
              value={tagId ?? 1}
              onChange={(e) => setTagId(Number(e.target.value))}
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

          {/* Assignee dropdown */}
          <Grid item xs={6}>
            <DropDown
              label="Asignee"
              value={assignedToName ?? ""}
              onSelect={(val) => {
                if (val === "") {
                  // user picked “None”
                  setAssignedToId(undefined);
                } else {
                  // could be either a number or a string
                  const id = typeof val === "number" ? val : Number(val);
                  setAssignedToId(id);
                }
              }}
              options={members.map((m) => m.id)}
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
