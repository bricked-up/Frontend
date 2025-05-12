/* src/components/organizations/OrganizationCard.tsx */

import React from "react";

import {
  Grow,
  Card,
  CardActions,
  Typography,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";

import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import EditRoundedIcon from "@mui/icons-material/EditRounded";

import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";

import GroupRoundedIcon from "@mui/icons-material/GroupRounded";

import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";

import { useTheme } from "@mui/material/styles";

import { tokens } from "../../theme";

import { Organization } from "../../utils/types";

interface OrganizationCardProps {
  organization: Organization;

  memberUsers: { userId?: number; name?: string }[];

  onEdit: (org: Organization) => void;
}

export const OrganizationCard: React.FC<OrganizationCardProps> = ({
  organization,

  onEdit,
}) => {
  const theme = useTheme();

  const isDark = theme.palette.mode === "dark";

  const colors = tokens(theme.palette.mode);

  const cardBg = isDark
    ? "rgba(50, 63, 83, 0.73)"
    : "rgba(255, 255, 255, 0.84)";

  const textColor = isDark ? "#e2e8f0" : "#1e293b";

  const borderColor = "#4cceac";

  return (
    <Grow in timeout={400}>
      <Card
        variant="outlined"
        sx={{
          borderLeft: `4px solid ${borderColor}`,

          p: 2,

          borderRadius: 2,

          bgcolor: cardBg,

          color: textColor,

          display: "flex",

          flexDirection: "column",

          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",

          gap: 1,

          transition: "transform 0.3s ease, box-shadow 0.3s ease",

          "&:hover": {
            transform: "translateY(-3px)",

            boxShadow: "0 8px 20px -5px rgba(0,0,0,0.3)",

            cursor: "pointer",
          },
        }}
        onClick={() => onEdit(organization)}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={0.5}>
            <BusinessRoundedIcon fontSize="medium" />

            <Typography variant="h6" fontWeight={700} noWrap>
              {organization.name}
            </Typography>
          </Box>

          <Tooltip title="Delete Organization">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <DeleteOutlineRoundedIcon color="error" />
            </IconButton>
          </Tooltip>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <GroupRoundedIcon fontSize="small" />

          <Typography variant="caption" sx={{ fontSize: "0.9rem" }}>
            Members: {organization.members?.length ?? 0}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <FormatListBulletedRoundedIcon fontSize="small" />

          <Typography variant="caption" sx={{ fontSize: "0.9rem" }}>
            Projects: {organization.projects?.length ?? 0}
          </Typography>
        </Box>
      </Card>
    </Grow>
  );
};

export default OrganizationCard;
