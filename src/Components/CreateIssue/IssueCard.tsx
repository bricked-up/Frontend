import React from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Button,
  Avatar,
  Grow,
} from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import LoyaltyRoundedIcon from "@mui/icons-material/LoyaltyRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { Issue } from "../../utils/types";
import { useTheme } from "@mui/material/styles";

interface issueCardProps {
  issue: Issue;
  boardId: number;
  onDelete: (issueId: number) => void;
  onComplete: (issueId: number) => void;
  onEdit: (issue: Issue) => void; // <-- Added for opening the edit modal
}

/**
 * issueCard.tsx
 *
 * Card component to display individual issue/issue.
 * Supports delete, complete/incomplete toggle, and edit on click.
 *
 * Props:
 *  - issue (issue): issue data
 *  - boardId (number): ID of the board
 *  - onDelete (function): Callback to delete issue
 *  - onComplete (function): Callback to complete/un-complete issue
 *  - onEdit (function): Callback to edit issue
 */

export const IssueCard: React.FC<issueCardProps> = ({
  issue,
  boardId,
  onDelete,
  onComplete,
  onEdit,
}) => {
  const isCompleted = !!issue.completed;

  const getBorderColor = () => {
    return isCompleted ? "#16a34a" : "#dc2626"; // green if complete, red if in progress
  };

  const theme = useTheme();
  const cardBackgroundColor =
    theme.palette.mode === "dark"
      ? "rgba(50, 63, 83, 0.73)"
      : "rgba(255, 255, 255, 0.84)";

  const textColor = theme.palette.mode === "dark" ? "#e2e8f0" : "#1e293b";

  return (
    <Grow in timeout={400}>
      <Card
        variant="outlined"
        sx={{
          borderLeft: `4px solid ${getBorderColor()}`,
          padding: "18px 20px",
          borderRadius: "14px",
          backgroundColor: cardBackgroundColor,
          color: textColor,
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
          fontFamily: "'Poppins', sans-serif",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "0 8px 25px -5px rgba(0, 0, 0, 0.3)",
            cursor: "pointer",
          },
        }}
        onClick={() => onEdit(issue)} // <-- clicking the card triggers edit
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={700} noWrap>
            {issue.title}
          </Typography>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation(); // prevent card click
              onDelete(issue.id);
            }}
          >
            <DeleteOutlineRoundedIcon color="error" />
          </IconButton>
        </Box>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontSize: "1rem", mb: 1 }}
        >
          {issue.desc}
        </Typography>

        <Box display="flex" alignItems="center" gap={0.8} mb={0.2}>
          <WarningAmberRoundedIcon fontSize="small" />
          <Typography variant="caption" sx={{ fontSize: "0.9rem" }}>
            Priority: {issue.priority}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={0.8} mb={0.2}>
          <LoyaltyRoundedIcon fontSize="small" />
          <Typography variant="caption" sx={{ fontSize: "0.9rem" }}>
            Tag ID: {issue.tagId}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={0.8} mb={0.2}>
          <PaidRoundedIcon fontSize="small" />
          <Typography variant="caption" sx={{ fontSize: "0.9rem" }}>
            Cost: {issue.cost}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={0.8} mb={0.2}>
          <TodayRoundedIcon fontSize="small" />
          <Typography variant="caption" sx={{ fontSize: "0.9rem" }}>
            Created: {issue.created ? new Date(issue.created).toLocaleDateString("en-GB") : "N/A"}
          </Typography>
        </Box>

        {issue.completed && (
          <Box display="flex" alignItems="center" gap={0.8} mb={0.2}>
            <CheckCircleRoundedIcon fontSize="small" />
            <Typography
              variant="caption"
              sx={{ fontSize: "0.9rem", color: "#4ade80" }}
            >
              Completed: {new Date(issue.completed).toLocaleDateString("en-GB")}
            </Typography>
          </Box>
        )}

        {issue.completed ? (
          <Box display="flex" justifyContent="center" mt={1.5}>
            <Button
              variant="outlined"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onComplete(issue.id);
              }}
              sx={{
                color: "#f59e0b",
                borderColor: "#f59e0b",
                fontWeight: "bold",
                borderRadius: "999px",
                paddingX: 3,
                paddingY: 1,
                fontSize: "0.85rem",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#f59e0b33",
                },
              }}
            >
              Mark Incomplete
            </Button>
          </Box>
        ) : (
          <Box display="flex" justifyContent="center" mt={1.5}>
            <Button
              variant="contained"
              size="small"
              startIcon={<CheckCircleRoundedIcon />}
              onClick={(e) => {
                e.stopPropagation();
                onComplete(issue.id);
              }}
              sx={{
                backgroundColor: "#16a34a",
                color: "#fff",
                fontWeight: "bold",
                borderRadius: "999px",
                paddingX: 3,
                paddingY: 1,
                fontSize: "0.85rem",
                textTransform: "none",
                boxShadow: "0px 4px 12px rgba(22, 163, 74, 0.4)",
                "&:hover": {
                  backgroundColor: "#15803d",
                  boxShadow: "0px 6px 16px rgba(22, 163, 74, 0.5)",
                },
              }}
            >
              Complete
            </Button>
          </Box>
        )}
      </Card>
    </Grow>
  );
};