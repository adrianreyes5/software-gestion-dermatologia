import Link from "next/link";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";

import { useForm } from "react-hook-form";
import * as yup from "yup";

import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Box, TextField, Chip, Paper } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import "./styles.scss";
import { yupResolver } from "@hookform/resolvers/yup";

import axios from "../../src/config/interceptor";
import SnackBar from "@/components/snackbar";
import React from "react";
import { MessageResponse } from "@/utils/types";
import { handleError } from "@/utils/response-handler";
import LoadingButton from "@/components/loadingButton";

import { setCookie } from "cookies-next";

const schema = yup
  .object({
    email: yup
      .string()
      .email("Debe ser un correo electronico valido")
      .required("El correo es requerido"),
    password: yup.string().required("La contraseña es requerida"),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

export default function Login() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [snackbarState, setSnackbarState] = React.useState<MessageResponse>({
    message: "",
    open: false,
    type: "success",
  });
  const [loading, setLoading] = React.useState<boolean>(false);

  const onSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      const response = await axios.post("login", formData);

      if (handleError(response.status)) {
        throw new Error(response.data?.Error);
      }

      const { data } = response.data;
      localStorage.setItem("token", data?.token);
      setCookie("token", data?.token);
      setCookie("user", JSON.stringify(data?.user));

      router.push("/");
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

  return (
    <main>
      <CssBaseline />
      <Container component="main" maxWidth="md">
        <Grid container spacing={2} mt={15}>
          <Grid
            item
            xs={12}
            sm={6}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h4" align="center" color={"primary"}>
              Bienvenido
            </Typography>
            <Typography variant="body1" paragraph align="center">
              Ingresa tus credenciales para acceder
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ padding: "20px" }}>
              <AccountCircleIcon
                sx={{ display: "flex", width: "100%", height: "150px" }}
                color="primary"
              />

              <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Correo electrónico"
                  autoComplete="email"
                  autoFocus
                  {...register("email")}
                  error={!!errors?.email?.message}
                  helperText={errors?.email?.message}
                />
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

                {loading ? (
                  <LoadingButton sx={{ marginTop: "15px" }} />
                ) : (
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: "15px" }}
                  >
                    Iniciar sesión
                  </Button>
                )}
              </form>
              <Box textAlign="center" mt={2} sx={{ textDecoration: "none" }}>
                <Link href="#" className="forgot-password">
                  ¿Has olvidado tu contraseña?
                </Link>
              </Box>
            </Paper>

            <Box mt={3} width="100%" textAlign="center">
              <Chip
                label="Si aún no tienes cuenta registrate"
                component="a"
                href="/register"
                variant="outlined"
                color="primary"
                clickable
              />
            </Box>
          </Grid>
        </Grid>
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
    </main>
  );
}
