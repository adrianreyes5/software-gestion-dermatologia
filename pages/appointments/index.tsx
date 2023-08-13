import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Chip,
  Button,
} from "@mui/material";
import axios from "../../src/config/interceptor";
import { Appointment, User } from "@/utils/types";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CancelIcon from '@mui/icons-material/Cancel';
import BlockIcon from '@mui/icons-material/Block';

interface Column {
  id: "patient" | "date" | "status" | "survey" | "treatment" | "start_time" | "actions";
  label: string;
  roles: number[];
  minWidth?: number;
  align?: "center";
}

const columns: readonly Column[] = [
  { 
    id: "treatment", 
    label: "Procedimiento", 
    roles: [1, 2],
    minWidth: 150 
  },
  { 
    id: "patient", 
    label: "Paciente", 
    roles: [1],
    minWidth: 150 
  },
  {
    id: "date",
    label: "Fecha",
    minWidth: 120,
    roles: [1, 2],
  },
  {
    id: "start_time",
    label: "Hora",
    roles: [1, 2],
    minWidth: 90,
  },
  {
    id: "status",
    label: "Estado",
    roles: [1, 2],
    minWidth: 100,
  },
  {
    id: "survey",
    label: "Encuesta",
    roles: [1, 2],
    minWidth: 100,
  },
  {
    id: "actions",
    label: "Acciones",
    roles: [1],
    minWidth: 100,
  }
];

function getColor(value: string) {
  if (value == "Aceptada") {
    return "success";
  } else if (value == "Pendiente") {
    return "warning";
  } else if (value == "Cancelada" || value == "Rechazada") {
    return "error";
  } else {
    return "primary";
  }
}

function getSurveyType(value: any) {
  const targetDate: any = new Date(value.created_at);
  const currentDate: any = new Date();

  const timeDifference = currentDate - targetDate;
  const threeDaysInMillis = 3 * 24 * 60 * 60 * 1000;
  
  if (timeDifference >= threeDaysInMillis ) { // > 3 days
    if (value.results != null) {
      return "Respondida";
    } else {
      return "Disponible";
    }
  } else  {
    return "Pendiente";
  } 
}

export default function AvailableTreatments() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [user, setUser] = React.useState<User>();

  React.useEffect(() => {
    const user: User = JSON.parse(localStorage.getItem("user") as string);

    setUser(user);

    const getData = async () => {
      try {
        let url;
        if(user.role_id == 2) {
          url = `/appointment/${user.id}`;      
        } else {
          url = `/appointments`;
        }    
        const response = await axios.get(url); // Replace with your API endpoint
        
        if(response.data.length > 0) {
          setAppointments(response.data);
        } else {
          setAppointments(response?.data?.data);
        }
      } catch (error) {
        // Handle the error here
        console.error(error);
      }
    };

    getData();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <CssBaseline />
      <main>
        <Container sx={{ py: 10 }} maxWidth="md">
          <Box my={4} textAlign="center" mt={0}>
            <Typography variant="h4" className="text-primary">
              Gestiona tus citas
            </Typography>
          </Box>

          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow sx={{}}>
                    {columns.map((column) => (
                      column.roles.includes(user?.role_id as number)) && (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        className="bg-light text-primary"
                        style={{ minWidth: column.minWidth }}
                      >
                        <b>{column.label}</b>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appointments?.length > 0 &&
                    appointments
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      ?.map((row, i) => {
                        return (
                          <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                            {columns.map((column) => {
                              const value: any = row[column.id];
                              return (
                                column.roles.includes(user?.role_id as number)) && (
                                <TableCell key={column.id} align={column.align}>
                                  {column.id == "status" ? (
                                    <Chip
                                      label={value}
                                      variant="outlined"
                                      color={getColor(value)}
                                    />
                                  ) : column.id == "survey" ? (
                                    getSurveyType(value)
                                  ) : column.id == "actions" ? (
                                    <>
                                      {row["status"] == "Pendiente" && (
                                        <>
                                          <CheckBoxIcon color="success" sx={{ cursor: "pointer", width: "30px", height: "30px" }} />
                                          <CancelIcon color="error" sx={{ cursor: "pointer", width: "30px", height: "30px" }} />
                                        </>
                                      )}
                                      {row["status"] == "Aceptada" && (
                                        <>
                                          <BlockIcon color="warning" sx={{ cursor: "pointer", width: "30px", height: "30px" }} />
                                        </>
                                      )}
                                    </>
                                  ) : (
                                    value
                                  )}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={appointments?.length || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Container>
      </main>
    </>
  );
}
