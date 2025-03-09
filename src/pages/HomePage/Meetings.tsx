import React from "react";
import { Container, Typography, List, ListItem, ListItemText } from "@mui/material";

interface Meeting {
  id: number;
  name: string;
  date: string;
}

const Meetings: React.FC = () => {
  const meetings: Meeting[] = [
    { id: 1, name: "Team Sync", date: "2025-03-01" },
    { id: 2, name: "Project Kickoff", date: "2025-03-05" },
  ];

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Meetings You Are In
      </Typography>
      <List>
        {meetings.map((meeting) => (
          <ListItem key={meeting.id}>
            <ListItemText primary={meeting.name} secondary={meeting.date} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Meetings;
