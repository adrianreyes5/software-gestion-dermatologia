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
    Chip
} from "@mui/material";

// styles
import "./styles.scss";

interface Column {
    id: 'name' | 'date' | 'status' | 'survey';
    label: string;
    minWidth?: number;
    align?: 'center';
}
  
const columns: readonly Column[] = [
    { id: 'name', label: 'Nombre', minWidth: 170 },
    {
      id: 'date',
      label: 'Fecha',
      minWidth: 170,
    },
    {
      id: 'status',
      label: 'Estado',
      minWidth: 170,
    },
    {
      id: 'survey',
      label: 'Encuesta',
      minWidth: 170,
    },
];

const rows = [
    {
        name: 'Tratamiento con Botox', 
        date: "10/10/2023 10:00", 
        status: "Aceptada",
        survey: "Disponible"
    },
    {
        name: 'Rellenos dérmicos (Ácido Hialurónico)', 
        date: "12/10/2023 10:00", 
        status: "Pendiente",
        survey: "Disponible"
    },
    {
        name: 'Peeling químico', 
        date: "30/10/2023 10:00", 
        status: "Rechazada",
        survey: "Respondida"
    },
    {
        name: 'Microdermoabrasión', 
        date: "14/10/2023 10:00", 
        status: "Aceptada",
        survey: "Respondida"
    },
    {
        name: 'Láser Fraccional', 
        date: "22/10/2023 10:00", 
        status: "Cancelada",
        survey: "Disponible"
    }
];

function getColor(value: string) {
    if(value == 'Aceptada') {
        return "success";
    } else if(value == 'Pendiente') {
        return "warning"
    } else if(value == 'Cancelada' || value == 'Rechazada') {
        return "error"
    } else {
        return "primary"
    }
}

export default function AvailableTreatments() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    

  return (
    <>
      <CssBaseline />
      <main>

        <Container sx={{ py: 5 }} maxWidth="md">
          <Box my={4} textAlign="center" mt={0}>
            <Typography variant="h4" className="text-primary">
              Gestiona tus citas
            </Typography>
          </Box>

          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow sx={{ }}>
                    {columns.map((column) => (
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
                    {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, i) => {
                        return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                            {columns.map((column) => {
                            const value = row[column.id];
                            return (
                                <TableCell key={column.id} align={column.align}>
                                    {column.id == 'status' ? 
                                    <Chip
                                        label={value}
                                        variant="outlined"
                                        color={getColor(value)}
                                    />    
                                   : value}
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
                count={rows.length}
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
