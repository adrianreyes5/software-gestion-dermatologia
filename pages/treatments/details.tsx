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
import axios from "../../src/config/interceptor";
import { MessageResponse, Treatment } from "@/utils/types";
import { createAppoiment } from "@/api/appoiment";
import SnackBar from "@/components/snackbar";
import { useRouter } from "next/router";

export default function AvailableTreatments() {
  const router = useRouter();

  const [openDateDialog, setOpenDateDialog] = React.useState<boolean>(false);
  const [selectedDate, setSelectedDate] = React.useState<string>("");
  const [selectedDateFormat, setSelectedDateFormat] =
    React.useState<string>("");
  const [appointmentType, setAppointmentType] = React.useState("Previa");
  const [loading, setLoading] = React.useState(false);
  const [details, setDetails] = React.useState<Treatment>();
  const [hourSelected, setHourSelected] = React.useState<string>();
  const [snackbarState, setSnackbarState] = React.useState<MessageResponse>({
    message: "",
    open: false,
    type: "success",
  });

  React.useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get("/treatments/1");

        setDetails(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    getData();
  }, []);

  const handleDate = (event: any) => {
    const date = dayjs(event).format("MMMM D, YYYY");
    const format = dayjs(event).format("YYYY-MM-DD");

    setSelectedDate(date);
    setSelectedDateFormat(format);
    setOpenDateDialog(true);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setAppointmentType(event.target.value);
  };

  const handleHoursSelected = async (hoursSelected: string[]) => {
    setHourSelected(hoursSelected[0].split(" ")[0]);
  };

  const handleAppoiment = async () => {
    const data = {
      date: selectedDateFormat,
      time: hourSelected as string,
      type: appointmentType === "Previa" ? "Cita Previa" : "Cita Formal",
      treatment: 1,
    };

    setLoading(true);

    const response = await createAppoiment(data);

    setSnackbarState({
      message: response.message,
      open: true,
      type: response.status as any,
    });

    setLoading(false);

    router.push("/");
  };

  return (
    <div>
      <Container sx={{ py: 4 }} maxWidth="md">
        <Link href="/" sx={{ cursor: "pointer" }}>
          <WestIcon sx={{ fontSize: "35px", marginBottom: "5px" }} />
        </Link>
        <Box my={1} textAlign="center">
          <Paper sx={{ padding: "20px" }}>
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <img
                  src="/images/botox.jpg"
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
                <Typography variant="body1" paragraph align="justify">
                  - Evaluación médica para asegurar que eres un candidato
                  adecuado.
                </Typography>

                <Typography variant="body1" paragraph align="justify">
                  <b>Costo:</b> Desde $300 a $800 por área tratada.
                </Typography>
                <Typography variant="body1" paragraph align="justify">
                  <b>Duración:</b> Alrededor de 10 a 15 minutos por sesión,
                  dependiendo de la cantidad de áreas tratadas.
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
                    onChange={handleChange}
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
                      <DateCalendar onChange={handleDate} />
                    </LocalizationProvider>
                    <TreatmentHoursDialog
                      open={openDateDialog}
                      setOpen={setOpenDateDialog}
                      date={selectedDate}
                      handleHoursSelected={handleHoursSelected}
                    />
                  </div>
                </Box>

                <Box sx={{ m: 1, position: "relative" }}>
                  <Button
                    variant="contained"
                    size="medium"
                    color="primary"
                    onClick={handleAppoiment}
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
