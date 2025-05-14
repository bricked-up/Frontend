// OrganizationCard.tsx
import { Card, CardContent, Typography, List, ListItem } from "@mui/material";
import { Organization } from "../../utils/types";

interface Props {
  organization: Organization;
  onEdit: (o: Organization) => void;
  onDelete: (id: number) => void;
}

export default function OrganizationCard({ organization, onEdit, onDelete }: Props) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{organization.name}</Typography>
        <Typography variant="subtitle2">Projects:</Typography>
        {organization.projects?.length
          ? (
            <List dense>
              {organization.projects.map(p => (
                <ListItem key={p.id}>
                  <Typography>{p.name}</Typography>
                </ListItem>
              ))}
            </List>
          )
          : <Typography color="text.secondary">No projects</Typography>
        }
      </CardContent>
      {/* your Edit/Delete buttons here */}
    </Card>
  );
}