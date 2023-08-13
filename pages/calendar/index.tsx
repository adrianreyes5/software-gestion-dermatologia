import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Appointment } from "@/utils/types";

import axios from "../../src/config/interceptor";

type CalendarList = {
  title: string;
  date: string;
};

export default function Calendar() {
  const [appoiments, setAppoiments] = React.useState<CalendarList[]>([]);

  React.useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`/appointments`);
        const data: Appointment[] = response.data.data;

        const calendarList = data.map((item) => ({
          title: item.treatment,
          date: `${item.date} ${item.start_time?.slice(0, 5)}`,
        }));

        setAppoiments(calendarList);
      } catch (error) {
        console.error(error);
      }
    };

    getData();
  }, []);

  const handleDate = (event: any) => {
    console.log(event);
  };

  return (
    <Box width="1600px" margin="100px auto">
      <Paper
        style={{
          fontFamily: "Roboto",
          width: "100%",
          height: 1000,
        }}
      >
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          locale="es"
          events={appoiments}
          eventClick={handleDate}
          height={1000}
        />
      </Paper>
    </Box>
  );
}
