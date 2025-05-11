import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Typography,
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
  initialData?: Issue;
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
  const [issueid, setIssueid] = useState(1);
  const [cost, setCost] = useState(0);
  const [projectid, setProjectid] = useState(0);
  const [tagid, setTagid] = useState(0);
  const [dependencyId, setDependencyId] = useState<number | null>(null);
  const [projectIssues, setProjectIssues] = useState<Issue[]>([]);
  const [loadingIssues, setLoadingIssues] = useState(false);
  const [issueError, setIssueError] = useState("");

  const theme = useTheme();
  const textColor = theme.palette.mode === "light" ? "black" : "white";

  const textFieldStyles = {
    style: { color: textColor },
  };

  const labelStyles = {
    style: { color: textColor },
  };

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDesc(initialData.desc || "");
      
      setPriority(initialData.priority || 1);
      setIssueid(initialData.id || 1);
      setCost(initialData.cost || 0);
      setProjectid(initialData.id || 0);
      setTagid(initialData.tagId || 0);
      fetchExistingDependency(initialData.id);
    } else {
      setTitle("");
      setDesc("");
      setPriority(1);
      setIssueid(1);
      setCost(0);
      setProjectid(0);
      setTagid(0);
      setDependencyId(null);
    }
  }, [initialData]);

  useEffect(() => {
    if (show && boardId) {
      fetchProjectIdByBoard();
    }
  }, [show, boardId]);

  const fetchProjectIdByBoard = async () => {
    try {
      const response = await fetch(`/api/board/${boardId}`);
      if (!response.ok) throw new Error("Could not fetch board info");
      const board = await response.json();
      const pid = board.projectid;
      setProjectid(pid);
      fetchProjectIssues(pid);
    } catch (err) {
      console.error("Error getting project ID from board:", err);
    }
  };

  const fetchProjectIssues = async (pid: number) => {
    setLoadingIssues(true);
    setIssueError("");
    try {
      const response = await fetch(`/api/project/${pid}/issues`);
      if (!response.ok) {
        throw new Error(`Failed to fetch issues: ${response.statusText}`);
      }
      const data = await response.json();
      const filtered = initialData
        ? data.filter((issue: Issue) => issue.id !== initialData.id)
        : data;
      setProjectIssues(filtered);
    } catch (error) {
      console.error("Error fetching project issues:", error);
      setIssueError("Failed to load available issues. Please try again.");
    } finally {
      setLoadingIssues(false);
    }
  };

  const fetchExistingDependency = async (issueId: number | undefined) => {
    if (!issueId) return;
    try {
      const response = await fetch(`/api/issue/${issueId}/dependency`);
      if (!response.ok) {
        if (response.status !== 404) throw new Error(response.statusText);
        setDependencyId(null);
        return;
      }
      const data = await response.json();
      if (data && data.dependency) {
        setDependencyId(data.dependency);
      } else {
        setDependencyId(null);
      }
    } catch (error) {
      console.error("Error fetching dependency:", error);
      setDependencyId(null);
    }
  };

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
      dependency: dependencyId,
    };

    const result = await createNewIssue(issueParams, "create-issue");
    if (result.status === 200 || result.status === 201) {
      onClose();
    } else {
      alert(`Error creating issue: ${result.error || "Unknown error"}`);
      console.error("Create issue failed:", result.error);
    }
  };

  const handleDependencyChange = (value: number | string | null) => {
    setDependencyId(value === "" ? null : (value as number));
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
              InputProps={textFieldStyles}
              InputLabelProps={labelStyles}
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
              InputProps={textFieldStyles}
              InputLabelProps={labelStyles}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Priority"
              type="number"
              fullWidth
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              InputProps={textFieldStyles}
              InputLabelProps={labelStyles}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Tag ID"
              type="number"
              fullWidth
              value={tagid}
              onChange={(e) => setTagid(Number(e.target.value))}
              InputProps={textFieldStyles}
              InputLabelProps={labelStyles}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Cost"
              type="number"
              fullWidth
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
              InputProps={textFieldStyles}
              InputLabelProps={labelStyles}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth error={!!issueError}>
              <InputLabel
                id="dependency-select-label"
                style={labelStyles.style}
              >
                Issue Dependency
              </InputLabel>
              <Select
                labelId="dependency-select-label"
                id="dependency-select"
                value={dependencyId === null ? "" : dependencyId}
                label="Issue Dependency"
                onChange={(e) => handleDependencyChange(e.target.value)}
                disabled={loadingIssues}
                style={textFieldStyles.style}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {projectIssues.map((issue) => (
                  <MenuItem key={issue.id} value={issue.id}>
                    {issue.title}
                  </MenuItem>
                ))}
              </Select>
              {loadingIssues && (
                <CircularProgress
                  size={24}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: "-12px",
                    marginLeft: "-12px",
                  }}
                />
              )}
              {issueError && <FormHelperText>{issueError}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ mt: 1, display: "block" }}
            >
              Dependency is optional. Select "None" if this issue has no
              dependencies.
            </Typography>
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
          disabled={loadingIssues}
        >
          {initialData ? "Save Changes" : "Add Issue"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};