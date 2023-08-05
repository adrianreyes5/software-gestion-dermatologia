import Link from "next/link";
import Button from "@mui/material/Button";

import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Box, TextField, Chip, Paper } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import "./styles.scss";

export default function Login() {
  return (
    <main>
      <CssBaseline />
      <Container component="main" maxWidth="md">
        <Grid container spacing={2} mt={15}>
          <Grid item xs={12} sm={6} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Typography variant="h4" align="center" color={"primary"}>
              Bienvenido
            </Typography>
            <Typography variant="body1" paragraph align="center">
              Ingresa tus credenciales para acceder
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ padding: "20px"}} >
              <AccountCircleIcon sx={{ display: 'flex', width: '100%', height: '150px' }} color="primary" />

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
                  sx={{ marginTop: '15px' }}
                >
                  Iniciar sesión
                </Button>

              </form>
              <Box textAlign="center" mt={2} sx={{ textDecoration: 'none'}}>
                <Link href="#" className="forgot-password">¿Has olvidado tu contraseña?</Link>
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
    </main>
  );
}
