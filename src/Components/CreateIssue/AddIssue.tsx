import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Grid,
  InputLabel,
  Popover,
  Box,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { Task } from "../../utils/types";
import { useTheme } from "@mui/material/styles";
import { getProject } from "../../utils/getters.utils"; // Ensure path is correct
import { SketchPicker } from "react-color"; // Importing SketchPicker from react-color

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
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState("#000000");
  const [cost, setCost] = useState(0);
  const [tagId, setTagId] = useState<number | null>(null); // required by backend

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // For Popover anchor
  const [colorPickerVisible, setColorPickerVisible] = useState(false); // For showing/hiding the color picker

  const theme = useTheme();
  const textColor = theme.palette.mode === "light" ? "black" : "white";

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDesc(initialData.desc || "");
      setPriority(initialData.priority || 1);
      setTagName(initialData.tagName || "");
      setTagColor(initialData.tagColor || "#000000");
      setCost(initialData.cost || 0);
      setTagId(initialData.tagid ?? null);
    } else {
      setTitle("");
      setDesc("");
      setPriority(1);
      setTagName("");
      setTagColor("#000000");
      setCost(0);
      setTagId(null);
    }
  }, [initialData]);

  const fetchTagId = async (): Promise<number | null> => {
    try {
      const { data, error } = await getProject(boardId);
      if (error || !data) {
        console.error("Failed to fetch project to get tag ID:", error);
        return null;
      }
      const matchedTag = data.tags?.find(
        (tag) => tag.name.toLowerCase() === tagName.trim().toLowerCase()
      );
      return matchedTag?.id ?? null;
    } catch (err) {
      console.error("Error while fetching tag ID:", err);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("Title is missing :p");
      return;
    }

    const resolvedTagId = await fetchTagId();
    if (resolvedTagId === null) {
      alert("Invalid tag name: could not find matching tag ID.");
      return;
    }

    const newTask: Task = {
      ...(initialData || {}),
      id: initialData
        ? initialData.id
        : Math.random().toString(36).substr(2, 9),
      title,
      desc,
      tagName,
      tagColor,
      priority,
      cost,
      tagid: resolvedTagId,
      created: initialData?.created || new Date(),
      createdBy: initialData?.createdBy || "You",
      completed: initialData?.completed,
    };

    onAdd(newTask);
    onClose();
  };

  // Toggle the color picker visibility and position the popover
  const toggleColorPicker = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget); // Toggle color picker visibility
  };

  // Handle color change from the SketchPicker
  const handleColorChange = (color: any) => {
    setTagColor(color.hex);
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
            <TextField
              label="Tag Name"
              fullWidth
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              InputProps={{ style: { color: textColor } }}
              InputLabelProps={{ style: { color: textColor } }}
            />
          </Grid>
          <Grid item xs={6}>
          <Button
            variant="contained"
            onClick={toggleColorPicker}
            style={{
            width: "100%",
            height: "56px",
            background: tagColor === "#000000"
            ? "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)"
            : tagColor,
            color: "#fff",
            fontWeight: "bold",
            textTransform: "none",
            borderRadius: "8px",
            boxShadow: "0 0 8px rgba(0,0,0,0.3)",
            transition: "transform 0.1s ease-in-out, background 0.3s ease",
           }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
          Add Tag Color
        </Button>


            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <Box padding={1}>
                <SketchPicker color={tagColor} onChange={handleColorChange} />
              </Box>
            </Popover>
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