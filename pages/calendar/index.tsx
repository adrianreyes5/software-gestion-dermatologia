import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

import "./styles.scss";

export default function Calendar() {
  const handleDate = (event: any) => {
    console.log(event);
  };

  return (
    <Box maxWidth="1200px" margin="100px auto">
      <Paper
        style={{
          fontFamily: "Roboto",
        }}
      >
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          locale="es"
          events={[
            { title: "event 1", date: "2023-08-01 10:00" },
            { title: "event 1", date: "2023-08-01 10:30" },
            { title: "event 2", date: "2023-08-02" },
          ]}
          eventClick={handleDate}
          
        />
      </Paper>
    </Box>
  );
}
