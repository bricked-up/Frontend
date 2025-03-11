import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";

interface CalendarEvent {
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
}

const CalendarComponent: React.FC = () => {
  // Mock Data - Replace with your JSON parsing logic
  const events: CalendarEvent[] = [
    { title: "Standup", start: "2025-03-02T08:00:00", end: "2025-03-02T09:00:00" },
    { title: "Lunch", start: "2025-03-02T12:00:00", end: "2025-03-02T13:00:00" },
    { title: "Offsite", start: "2025-03-03T00:00:00", allDay: true },
    { title: "Busy", start: "2025-03-03T07:00:00", end: "2025-03-03T08:00:00" },
  ];

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
      />
    </div>
  );
};

export default CalendarComponent;