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
  Link
} from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import WestIcon from '@mui/icons-material/West';
import { useRouter } from 'next/router';
import axios from "@/config/interceptor";

interface Treatment {
    "id": number;
    "name": string;
    "description": string;
    "cost": number;
    "duration": number;
    "image-url": string;
    "protocols": string;
    "created_at": Date;
    "updated_at": Date;
}

export default function AvailableTreatments() {
  const [openDateDialog, setOpenDateDialog] = React.useState<boolean>(false);
  const [selectedDate, setSelectedDate] = React.useState<string>("");
  const [appointmentType, setAppointmentType] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [treatment, setTreatment] = React.useState<Treatment>({} as Treatment);
  const timer = React.useRef<number>();
  const router = useRouter();
  const { id } = router.query;

  React.useEffect(() => {
    const getData = async () => {
        try {
          const response = await axios.get(`/treatments/${id}`); // Replace with your API endpoint
  
          // Handle the response data here
          console.log(response.data);
          const data: Treatment = response.data;
          setTreatment(data);
        } catch (error) {
          // Handle the error here
          console.error(error);
        }
      };
  
      getData();

    return () => {
      clearTimeout(timer.current);
      console.log('id', id )
    };
  }, []);

  const handleDate = (event: any) => {
    const date = dayjs(event).format("MMMM D, YYYY");

    setSelectedDate(date);
    setOpenDateDialog(true);
  };

  const handleChangeType = (event: SelectChangeEvent) => {
    setAppointmentType(event.target.value);
  };

  const handleAppointment = () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      timer.current = window.setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 2000);
    }
  };
  return (
    <div>
      <Container sx={{ py: 4 }} maxWidth="md">
        <Link href="/treatments" sx={{ cursor: 'pointer' }}>
          <WestIcon sx={{fontSize: '35px', marginBottom: '5px'}} />
        </Link>
        <Box my={1} textAlign="center">
          <Paper sx={{ padding: "20px"}}>
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
                  {treatment.name}
                </Typography>

                <Typography variant="body1" paragraph align="justify"  mt={2}>
                  {treatment.description}
                </Typography>

                <Typography variant="h6" className="text-primary">
                  Requisitos previos
                </Typography>
                <Typography variant="body1" paragraph align="justify">
                  - Evaluación médica para asegurar que eres un candidato adecuado.
                </Typography>

                <Typography variant="body1" paragraph align="justify">
                  <b>Costo:</b> {treatment.cost}$
                </Typography>
                <Typography variant="body1" paragraph align="justify">
                  <b>Duración:</b> {treatment.duration} hora(s)
                </Typography>

                <FormControl sx={{ my: 3, minWidth: 130, display: 'flex' }} size="small" >
                  <InputLabel id="appointment-type-label">Tipo de cita</InputLabel>
                  <Select
                    labelId="appointment-type-label"
                    id="appointment-type"
                    defaultValue={""}
                    value={appointmentType}
                    label="Tipo de cita *"
                    onChange={handleChangeType}
                    sx={{ maxWidth: 140 }}
                  >
                    <MenuItem value={"Previa"}>Previa</MenuItem>
                    <MenuItem value={"Formal"}>Formal</MenuItem>
                  </Select>
                </FormControl>

                <Box textAlign="left" >
                  <Typography variant="subtitle1" className="text-primary" >
                    Escoge una fecha:
                  </Typography>
                  <div>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                      <DateCalendar onChange={handleDate}  />
                    </LocalizationProvider>
                    <TreatmentHoursDialog
                      open={openDateDialog}
                      setOpen={setOpenDateDialog}
                      date={selectedDate}
                    />
                  </div>
                </Box>

                <Box sx={{ m: 1, position: 'relative' }}>
                  <Button
                    variant="contained"
                    size="medium" 
                    color="primary" 
                    onClick={handleAppointment}
                    disabled={appointmentType === '' || loading}
                  >
                    Agendar
                  </Button>
                  {loading && (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: "primary",
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: '-12px',
                        marginLeft: '-12px',
                      }}
                    />
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Container>
    </div>
  );
}
