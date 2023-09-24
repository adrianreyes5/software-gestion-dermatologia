import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import Container from "@mui/material/Container";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Appointment, MessageResponse, Treatment } from "@/utils/types";

import CssBaseline from "@mui/material/CssBaseline";
import axios from "../../src/config/interceptor";
import { Button } from "@mui/material";
import NoLaboralDayDialog from "@/components/treatment-hours-dialog/no-laboral-day-dialog";
import { getDateAvailableHours } from "@/api/treatment";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { createAppointment } from "@/api/appointment";
import SnackBar from "@/components/snackbar";

type CalendarList = {
  title: string;
  date: string;
};

export default function Calendar() {
  const [appoiments, setAppoiments] = React.useState<CalendarList[]>([]);
  const [openDateDialog, setOpenDateDialog] = React.useState<boolean>(false);
  const [selectedDate, setSelectedDate] = React.useState<string>("");
  const [hourSelected, setHourSelected] = React.useState<{
    start_time: string;
    end_time: string;
  }>();
  const [details, setDetails] = React.useState<Treatment>();
  const [appointmentType, setAppointmentType] = React.useState("No Laboral");
  const [unavailableDates, setUnavailableDates] = React.useState<string[]>();
  const [selectedDateFormat, setSelectedDateFormat] =
    React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [snackbarState, setSnackbarState] = React.useState<MessageResponse>({
    message: "",
    open: false,
    type: "success",
  });

  const getData = async () => {
    try {
      const response = await axios.get(`/appointments`);
      const data: Appointment[] = response.data.data;

      const calendarList = data.map((item) => ({
        title: `${item.treatment} - ${item.patient}`,
        date: `${item.date} ${item.start_time?.slice(0, 5)}`,
      }));

      setAppoiments(calendarList);
    } catch (error) {
      console.error(error);
    }
  };
  React.useEffect(() => {
    getData();
  }, []);

  React.useEffect(() => {
    const getHours = async () => {
      const date = dayjs().format("MMMM D, YYYY");
      const format = dayjs().format("YYYY-MM-DD");

      checkDateHours(format);
    };

    if (openDateDialog) getHours();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openDateDialog]);

  const handleHoursSelected = async (hoursSelected: string[]) => {
    setHourSelected({
      start_time: hoursSelected[0],
      end_time: hoursSelected[hoursSelected.length - 1],
    });

    handleAppointment(
      hoursSelected[0],
      hoursSelected[hoursSelected.length - 1]
    );
  };

  const checkDateHours = async (date: string) => {
    const { data } = await getDateAvailableHours(date);

    setUnavailableDates(data);
  };

  const handleDate = (event: any) => {
    const date = dayjs(event).format("MMMM D, YYYY");
    const format = dayjs(event).format("YYYY-MM-DD");

    checkDateHours(format);

    setSelectedDate(date);
    setSelectedDateFormat(format);
    setOpenDateDialog(true);
  };

  const handleAppointment = async (start_time: string, end_time: string) => {
    try {
      const data = {
        date: selectedDateFormat || dayjs(new Date()).format("YYYY-MM-DD"),
        start_time,
        end_time,
        type: "No Laboral",
        treatment: 1,
      };

      setLoading(true);

      const response = await createAppointment(data);

      setSnackbarState({
        message: response.message,
        open: true,
        type: response.status as any,
      });

      setLoading(false);

      setOpenDateDialog(false);
      getData();
    } catch (error) {
      setSnackbarState({
        message: "Ha ocurrido un error",
        open: true,
        type: "error",
      });
    }
  };

  return (
    <main>
      <CssBaseline />
      <Container sx={{ py: 10 }} maxWidth="lg">
        <Box maxWidth="1440px" sx={{ width: "100%" }}>
          <Box mb={2} textAlign="end">
            <Button variant="contained" onClick={() => setOpenDateDialog(true)}>
              Día no laboral
            </Button>
          </Box>
          <Paper
            style={{
              fontFamily: "Roboto",
              width: "100%",
              padding: 20,
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
      </Container>

      {openDateDialog && (
        <NoLaboralDayDialog
          open={openDateDialog}
          setOpen={setOpenDateDialog}
          date={selectedDate}
          handleHoursSelected={handleHoursSelected}
          duration={
            appointmentType === "Previa" ? 1 : (details?.duration as number)
          }
          unavailableDates={unavailableDates as string[]}
          handleDate={handleDate}
          loading={loading}
          setLoading={setLoading}
        />
      )}

      {snackbarState.open && (
        <SnackBar
          snackbarState={snackbarState}
          setSnackbarState={() => {
            setSnackbarState((prev) => ({
              ...prev,
              message: "",
              open: false,
            }));
          }}
        />
      )}
    </main>
  );
}
