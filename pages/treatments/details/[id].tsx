import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import "dayjs/locale/es";

import dayjs from "dayjs";
import TreatmentHoursDialog from "@/components/treatment-hours-dialog";
import {
  Grid,
  Container,
  Box,
  InputLabel,
  Typography,
  MenuItem,
  FormControl,
  Button,
  CircularProgress,
  Paper,
  Link,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import WestIcon from "@mui/icons-material/West";
import { useRouter } from "next/router";
import { MessageResponse, Treatment } from "@/utils/types";
import { createAppointment } from "@/api/appointment";
import SnackBar from "@/components/snackbar";
import axios from "@/config/interceptor";
import { getDateAvailableHours } from "@/api/treatment";

export default function AvailableTreatments() {
  const router = useRouter();
  const { id } = router.query;

  const [openDateDialog, setOpenDateDialog] = React.useState<boolean>(false);
  const [selectedDate, setSelectedDate] = React.useState<string>("");
  const [selectedDateFormat, setSelectedDateFormat] =
    React.useState<string>("");
  const [appointmentType, setAppointmentType] = React.useState("Previa");
  const [loading, setLoading] = React.useState(false);
  const [details, setDetails] = React.useState<Treatment>();
  const [protocols, setProtocols] = React.useState([] as string[]);
  const [hourSelected, setHourSelected] = React.useState<{
    start_time: string;
    end_time: string;
  }>();
  const [unavailableDates, setUnavailableDates] = React.useState<string[]>();
  const [snackbarState, setSnackbarState] = React.useState<MessageResponse>({
    message: "",
    open: false,
    type: "success",
  });

  React.useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`/treatments/${id}`);
        const data: Treatment = response.data;

        setProtocols(data.protocols.split("-"));
        setDetails(data);
      } catch (error) {
        console.error(error);
      }
    };

    getData();
  }, []);

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

  const handleChangeType = (event: SelectChangeEvent) => {
    setAppointmentType(event.target.value);
  };

  const handleHoursSelected = async (hoursSelected: string[]) => {
    setHourSelected({
      start_time: hoursSelected[0],
      end_time: hoursSelected[hoursSelected.length - 1],
    });
  };

  const handleAppointment = async () => {
    const data = {
      date: selectedDateFormat,
      start_time: hourSelected?.start_time as string,
      end_time: hourSelected?.end_time as string,
      type: appointmentType === "Previa" ? "Cita Previa" : "Cita Formal",
      treatment: parseInt(id as string),
    };

    setLoading(true);

    const response = await createAppointment(data);

    setSnackbarState({
      message: response.message,
      open: true,
      type: response.status as any,
    });

    setLoading(false);
    if(response.status === "success") {
      setTimeout(() => {
        router.push("/appointments");
      }, 2000);
    }
  };

  return (
    <div>
      <Container sx={{ py: 8 }} maxWidth="md">
        <Button onClick={() => router.back()} sx={{ cursor: "pointer", p: 0, justifyContent: 'start' }}>
          <WestIcon sx={{ fontSize: "35px", marginBottom: "5px" }} />
        </Button>
        <Box my={1} textAlign="center">
          <Paper sx={{ padding: "20px" }}>
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <img
                  src={details?.["image-url"]}
                  alt="Descripción de la imagen"
                  width="100%"
                  loading="lazy"
                  style={{ borderRadius: "10px" }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h4" className="text-primary">
                  {details?.name}
                </Typography>

                <Typography variant="body1" paragraph align="justify" mt={2}>
                  {details?.description}
                </Typography>

                <Typography variant="h6" className="text-primary">
                  Requisitos previos
                </Typography>
                {protocols.map((protocol, index) => (
                  <Typography
                    variant="body1"
                    paragraph
                    align="justify"
                    key={index}
                    sx={{ marginBottom: "0px", marginTop: "5px" }}
                  >
                    - {protocol}
                  </Typography>
                ))}

                <Typography variant="body1" paragraph align="justify" mt={2}>
                  <b>Costo:</b> {details?.cost}$
                </Typography>
                <Typography variant="body1" paragraph align="justify">
                  <b>Duración:</b> {details?.duration} hora(s)
                </Typography>

                <FormControl
                  sx={{ my: 3, minWidth: 130, display: "flex" }}
                  size="small"
                >
                  <InputLabel id="appointment-type-label">
                    Tipo de cita
                  </InputLabel>
                  <Select
                    labelId="appointment-type-label"
                    id="appointment-type"
                    defaultValue="Previa"
                    value={appointmentType}
                    label="Tipo de cita *"
                    onChange={handleChangeType}
                    sx={{ maxWidth: 140 }}
                  >
                    <MenuItem value="Previa">Previa</MenuItem>
                    <MenuItem value="Formal">Formal</MenuItem>
                  </Select>
                </FormControl>

                <Box textAlign="left">
                  <Typography variant="subtitle1" className="text-primary">
                    Escoge una fecha:
                  </Typography>
                  <div>
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      adapterLocale="es"
                    >
                      <DateCalendar
                        onChange={handleDate}
                        minDate={dayjs(new Date())}
                      />
                    </LocalizationProvider>
                    <TreatmentHoursDialog
                      open={openDateDialog}
                      setOpen={setOpenDateDialog}
                      date={selectedDate}
                      handleHoursSelected={handleHoursSelected}
                      duration={details?.duration as number}
                      unavailableDates={unavailableDates as string[]}
                    />
                  </div>
                </Box>

                <Box sx={{ m: 1, position: "relative" }}>
                  <Button
                    variant="contained"
                    size="medium"
                    color="primary"
                    onClick={handleAppointment}
                    disabled={(!hourSelected && !selectedDateFormat) || loading}
                  >
                    Agendar
                  </Button>
                  {loading && (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: "primary",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        marginTop: "-12px",
                        marginLeft: "-12px",
                      }}
                    />
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Container>

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
    </div>
  );
}
