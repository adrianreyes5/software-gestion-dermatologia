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
  Button,
  TextField,
  Tooltip,
} from "@mui/material";
import axios from "../../src/config/interceptor";
import { Item, User, MessageResponse } from "@/utils/types";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import SnackBar from "@/components/snackbar";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@/components/loading-button";
import { handleError } from "@/utils/response-handler";

interface Column {
  id: "name" | "quantity" | "actions";
  label: string;
  roles: number[];
  minWidth?: number;
  align?: "center";
}

const columns: readonly Column[] = [
  {
    id: "name",
    label: "Nombre",
    roles: [1],
    minWidth: 150,
  },
  {
    id: "quantity",
    label: "Cantidad",
    roles: [1],
    minWidth: 100,
  },
  {
    id: "actions",
    label: "Acciones",
    roles: [1],
    minWidth: 100,
  },
];

const schema = yup.object({
  name: yup.string().required("Nombre es requerido"),
  quantity: yup.number(),
});

const defaultValues: Item = {
  id: 0,
  name: "",
  quantity: 1,
  actions: "",
};

export default function AvailableTreatments() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [items, setItems] = React.useState<Item[]>([]);
  const [user, setUser] = React.useState<User>();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [snackbarState, setSnackbarState] = React.useState<MessageResponse>({
    message: "",
    open: false,
    type: "success",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getData = async () => {
    try {
      const response = await axios.get("/inventory"); // Replace with your API endpoint

      if (response.data.length > 0) {
        setItems(response.data);
      } else {
        setItems(response?.data?.data);
      }
    } catch (error) {
      // Handle the error here
      console.error(error);
    }
  };

  React.useEffect(() => {
    const user: User = JSON.parse(localStorage.getItem("user") as string);
    setUser(user);

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

  const handleItemsActions = async (id: number, action: string) => {
    console.log(id, action);

    try {
        if( action == "Delete") {
            const response = await axios.delete(`/inventory/${id}`);
            if(response.status == 200) {
                setSnackbarState({
                    open: true,
                    type: "success",
                    message: "Eliminado exitosamente",
                });
                getData();
            }
        }
    } catch (error) {
      // Handle the error here
      console.error(error);
    }
  };

  const onSubmit = async (formData: any) => {
    setLoading(true);

    try {
        const response = await axios.post(`/inventory`, formData);
        if (handleError(response.status)) {
            throw new Error(response.data?.Error);
        }

        const { data } = response;
        if(data.id) {
            setSnackbarState({
                open: true,
                type: "success",
                message: "Creado exitosamente",
            });
            getData();
        }

    } catch (error: any) {
        setSnackbarState({
            open: true,
            type: "error",
            message: error?.message as string,
        });
    } finally {
        setLoading(false);
        setOpen(false);
    }
  };

  return (
    <>
      <CssBaseline />
      <main>
        <Container sx={{ py: 10 }} maxWidth="md">
          <Box my={4} textAlign="center" mt={0}>
            <Typography variant="h4" className="text-primary">
              Gestiona tu inventario
            </Typography>
          </Box>

          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow sx={{}}>
                    {columns.map(
                      (column) =>
                        column.roles.includes(user?.role_id as number) && (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            className="bg-light text-primary"
                            style={{ minWidth: column.minWidth }}
                          >
                            <b>{column.label}</b>
                          </TableCell>
                        )
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items?.length > 0 &&
                    items
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
                                column.roles.includes(
                                  user?.role_id as number
                                ) && (
                                  <TableCell
                                    key={column.id}
                                    align={column.align}
                                  >
                                    {column.id == "actions" ? (
                                      <Box sx={{ display: "flex" }}>
                                        <Button
                                          sx={{
                                            minWidth: "0px",
                                            p: 0,
                                            paddingRight: "5px",
                                          }}
                                          onClick={() =>
                                            handleItemsActions(
                                              row["id"],
                                              "Edit"
                                            )
                                          }
                                        >
                                          <EditIcon
                                            sx={{
                                              cursor: "pointer",
                                              width: "30px",
                                              height: "30px",
                                              color: "text.primary",
                                            }}
                                          />
                                        </Button>
                                        <Button
                                          sx={{
                                            minWidth: "0px",
                                            p: 0,
                                            paddingRight: "5px",
                                          }}
                                          onClick={() =>
                                            handleItemsActions(
                                              row["id"],
                                              "Delete"
                                            )
                                          }
                                        >
                                          <DeleteIcon
                                            color="error"
                                            sx={{
                                              cursor: "pointer",
                                              width: "30px",
                                              height: "30px",
                                            }}
                                          />
                                        </Button>
                                      </Box>
                                    ) : (
                                      value
                                    )}
                                  </TableCell>
                                )
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
              count={items?.length || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle color={"primary"}>Nuevo item</DialogTitle>

              <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="normal"
                    id="name"
                    label="Nombre"
                    type="text"
                    variant="outlined"
                    size="small"
                    {...register("name")}
                    error={!!errors?.name?.message}
                    sx={{ marginRight: "10px" }}
                  />
                  <TextField
                    margin="normal"
                    id="quantity"
                    label="Cantidad"
                    type="number"
                    variant="outlined"
                    size="small"
                    {...register("quantity")}
                  />
                </DialogContent>
                <DialogActions sx={{padding: "0 24px 20px"}}>
                  <Button onClick={handleClose}>Cancelar</Button>
                  {loading ? (
                    <LoadingButton sx={{ width: "fit-content" }} />
                  ) : (
                    <Button
                      type="submit"
                      size="small"
                      variant="contained"
                      color="primary"
                    >
                      Crear
                    </Button>
                  )}
                </DialogActions>
              </form>
            </Dialog>
          </Paper>
        </Container>

        <Tooltip title="Nuevo Item">
          <Fab
            color="primary"
            aria-label="add"
            sx={{ position: "fixed", bottom: "4%", right: "3%" }}
            onClick={handleClickOpen}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
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
    </>
  );
}
