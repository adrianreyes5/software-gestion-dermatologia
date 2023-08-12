import { useRouter } from "next/router";

import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { Box, TextField, Paper } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import React from "react";
import { handleError } from "@/utils/response-handler";
import { MessageResponse } from "@/utils/types";

import axios from "../../src/config/interceptor";
import LoadingButton from "@/components/loading-button";
import SnackBar from "@/components/snackbar";

import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const schema = yup
  .object({
    first_name: yup.string().required("Nombre es requerido"),
    last_name: yup.string().required("Apellido es requerido"),
    phone: yup.string().required("Teléfono es requerido"),
    address: yup.string().required("Dirección es requerido"),
    birthday: yup.string().required("Fecha de nacimiento es requerido"),
    email: yup
      .string()
      .email("Debe ser un correo electronico valido")
      .required("El correo es requerido"),
    password: yup.string().required("La contraseña es requerida"),
    confirm_password: yup
      .string()
      .required("Confirmar contraseña es requerido")
      .oneOf([yup.ref("password")], "La contraseña no coincide"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = React.useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      birthday: dayjs(new Date()).format("DD/MM/YYYY"),
    },
  });

  const [snackbarState, setSnackbarState] = React.useState<MessageResponse>({
    message: "",
    open: false,
    type: "success",
  });

  const onSubmit = async (formData: FormData) => {
    setLoading(true);

    try {
      const response = await axios.post("register", formData);

      if (handleError(response.status)) {
        throw new Error(response.data?.message);
      }

      const { data } = response.data;

      if(data.id) {
        setSnackbarState({
          open: true,
          type: "success",
          message: "Registrado exitosamente",
        });
  
        router.push("/login");
      }

    } catch (error: any) {
      setSnackbarState({
        open: true,
        type: "error",
        message: error?.message as string,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date: any) => {
    setValue("birthday", dayjs(date).format("DD/MM/YYYY"));
  };

  return (
    <main>
      <>
        <CssBaseline />
        <Container component="main" maxWidth="sm">
          <Grid container spacing={2} my={10}>
            <Grid item xs={12} sm={12}>
              <Paper sx={{ padding: "20px" }}>
                <AccountCircleIcon
                  sx={{ display: "flex", width: "100%", height: "150px" }}
                  color="primary"
                />
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Box sx={{ display: "flex", gap: "15px" }}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="first_name"
                      label="Nombre"
                      type="text"
                      autoComplete="Jhon"
                      {...register("first_name")}
                      error={!!errors?.first_name?.message}
                      helperText={errors?.first_name?.message}
                    />
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      label="Apellido"
                      type="text"
                      id="last_name"
                      autoComplete="Doe"
                      {...register("last_name")}
                      error={!!errors?.last_name?.message}
                      helperText={errors?.last_name?.message}
                    />
                  </Box>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="email"
                    label="Correo electrónico"
                    autoComplete="email"
                    type="email"
                    autoFocus
                    {...register("email")}
                    error={!!errors?.email?.message}
                    helperText={errors?.email?.message}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="phone"
                    label="Nro de teléfono"
                    autoComplete="+12345678"
                    {...register("phone")}
                    error={!!errors?.phone?.message}
                    helperText={errors?.phone?.message}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="address"
                    label="Dirección"
                    autoComplete="Example address"
                    {...register("address")}
                    error={!!errors?.address?.message}
                    helperText={errors?.address?.message}
                  />

                  <Box mt={1} width="100% ">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        defaultValue={null}
                        className="full-w"
                        onChange={handleDateChange}
                      />
                    </LocalizationProvider>
                  </Box>

                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Contraseña"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    {...register("password")}
                    error={!!errors?.password?.message}
                    helperText={errors?.password?.message}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Confirmar Contraseña"
                    type="password"
                    id="confirm_password"
                    autoComplete="current-password"
                    {...register("confirm_password")}
                    error={!!errors?.confirm_password?.message}
                    helperText={errors?.confirm_password?.message}
                  />

                  {loading ? (
                    <LoadingButton sx={{ marginTop: "15px" }} />
                  ) : (
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      sx={{ marginTop: "15px", marginBottom: "5px" }}
                    >
                      Registrar
                    </Button>
                  )}
                </form>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </>

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
