import Link from "next/link";
import Button from "@mui/material/Button";

import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Box, TextField } from "@mui/material";

import "./styles.scss";

export default function Login() {
  return (
    <main>
      <CssBaseline />
      <Container component="main" maxWidth="md">
        <Grid container spacing={2} mt={20}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h5" align="center">
              Bienvenido
            </Typography>
            <Typography variant="body2" align="center">
              Ingresa tus credenciales para acceder
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <form noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Correo electrónico"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Iniciar sesión
              </Button>

              <Box textAlign="center" mt={2}>
                <Link href="#">¿Has olvidado tu contraseña?</Link>
              </Box>
            </form>

            <Box mt={2} width="100%" textAlign="center">
              <Typography>
                Si aún no tienes cuenta{" "}
                <Link href="#" className="register-link">
                  registrate
                </Link>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}
