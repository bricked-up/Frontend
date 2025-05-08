/**
 * @fileoverview A card component displaying organization info: name, description,
 * member count, and project count, with edit and delete actions.
 */
import React from 'react';
import {
  Grow,
  Card,
  CardContent, // Imported from MUI for card content structure (unused but kept for consistency)
  CardActions, // Provides styling for action buttons
  Typography,  // For text display
  IconButton,  // For clickable icon buttons
  Box,         // For layout and flexbox containers
  Tooltip,     // For hover tooltips on icons
} from '@mui/material';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'; // Icon for delete action
import EditRoundedIcon from '@mui/icons-material/EditRounded';                // Icon for edit action
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';       // Icon representing an organization
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';             // Icon for member count
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded'; // Icon for project list
import { Organization } from '../../utils/Organization'; // Type definition for organization data
import { useTheme } from '@mui/material/styles'; // Hook to access theme settings
import { tokens } from '../../theme'; // Utility to get theme tokens

/**
 * Props for OrganizationCard component.
 * @interface OrganizationCardProps
 * @property {Organization} organization - Data for the organization.
 * @property {(id: string) => void} onDelete - Callback when delete icon is clicked.
 * @property {(org: Organization) => void} onEdit - Callback when card or edit icon is clicked.
 */
interface OrganizationCardProps {
  organization: Organization;
  onDelete: (id: string) => void;
  onEdit: (org: Organization) => void;
}

/**
 * OrganizationCard
 * Renders a stylized card with organization information and actions.
 * - Displays name with icon
 * - Shows optional description
 * - Indicates member and project counts
 * - Allows editing by clicking anywhere on the card or edit icon
 * - Allows deletion via delete icon
 *
 * @param {OrganizationCardProps} props - Component props
 * @returns {JSX.Element} The rendered card element
 */
export const OrganizationCard: React.FC<OrganizationCardProps> = ({
  organization,
  onDelete,
  onEdit,
}) => {
  // Determine if theme is dark mode for styling
  
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const colors = tokens(theme.palette.mode);
  // Background colors adapt to theme
  const cardBg = isDark ? 'rgba(50, 63, 83, 0.73)' : 'rgba(255, 255, 255, 0.84)';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const borderColor = '#3b82f6'; // Accent color for left border

  return (
    // Grow animation for initial mount
    <Grow in timeout={400}>
      <Card
        variant="outlined"
        sx={{
          borderLeft: `4px solid ${borderColor}`, // Accent border
          padding: '16px',                         // Inner spacing
          borderRadius: '12px',                    // Rounded corners
          backgroundColor: cardBg,                 // Theme-based bg
          color: textColor,                        // Theme-based text color
          display: 'flex',                         // Flex container
          flexDirection: 'column',                 // Vertical layout
          gap: 1,                                   // Spacing between items
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-3px)',         // Lift effect
            boxShadow: '0 8px 20px -5px rgba(0,0,0,0.3)',
            cursor: 'pointer',                     // Indicate clickable
          },
        }}
        onClick={() => onEdit(organization)} // Click card to edit
      >
        {/* Header section: icon, name, delete action */}
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
              onClick={e => {
                e.stopPropagation(); // Prevent card click
                onDelete(organization.id);
              }}
            >
              <DeleteOutlineRoundedIcon color="error" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Optional description: shown only if provided */}
        {organization.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: '0.95rem' }}
          >
            {organization.description}
          </Typography>
        )}

        {/* Display member count */}
        <Box display="flex" alignItems="center" gap={1}>
          <GroupRoundedIcon fontSize="small" />
          <Typography variant="caption" sx={{ fontSize: '0.9rem' }}>
            Members: {organization.members.length}
          </Typography>
        </Box>

        {/* Display project count */}
        <Box display="flex" alignItems="center" gap={1}>
          <FormatListBulletedRoundedIcon fontSize="small" />
          <Typography variant="caption" sx={{ fontSize: '0.9rem' }}>
            Projects: {organization.projects.length}
          </Typography>
        </Box>

        {/* Action buttons: edit */}
        <CardActions sx={{ justifyContent: 'flex-end', pt: 1 }}>
          <Tooltip title="Edit Organization" sx={{color:
              theme.palette.mode === "dark"
                ? colors.greenAccent[400]
                : colors.blueAccent[600],}}>
            <IconButton
              size="small"
              onClick={e => {
                e.stopPropagation(); // Prevent card click
                onEdit(organization);
              }}
            >
              <EditRoundedIcon />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>
    </Grow>
  );
};

export default OrganizationCard;
