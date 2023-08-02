import Link from "next/link";
import Button from "@mui/material/Button";

import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Box, TextField } from "@mui/material";

import "./styles.scss";

export default function Register() {
  return (
    <main>
      <>
        {" "}
        <CssBaseline />
        <Container component="main" maxWidth="sm">
          <Grid container spacing={2} mt={20}>
            <Grid item xs={12} sm={12}>
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
                  type="email"
                  autoFocus
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Nombre"
                  name="name"
                  type="text"
                  autoComplete="Jhon"
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="last-name"
                  label="Apellido"
                  type="text"
                  id="last-name"
                  autoComplete="Doe"
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="phone-number"
                  label="Nro de teléfono"
                  name="phone-number"
                  autoComplete="+12345678"
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="address"
                  label="Dirección"
                  name="address"
                  autoComplete="Example address"
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="date"
                  label="Fecha de nacimiento"
                  name="date"
                  autoComplete="11/05/2000"
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
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="confirm-password"
                  label="Confirmar Contraseña"
                  type="password"
                  id="confirm-password"
                  autoComplete="current-password"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Registrar
                </Button>
              </form>
            </Grid>
          </Grid>
        </Container>
      </>
    </main>
  );
}
