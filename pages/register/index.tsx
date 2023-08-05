import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { Box, TextField, Paper } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import "./styles.scss";

export default function Register() {
  return (
    <main>
      <>
        {" "}
        <CssBaseline />
        <Container component="main" maxWidth="sm">
          <Grid container spacing={2} mt={5}>
            <Grid item xs={12} sm={12}>
              <Paper sx={{ padding: "20px"}} >
                <AccountCircleIcon sx={{ display: 'flex', width: '100%', height: '150px' }} color="primary" />
                <form noValidate>
                  <Box sx={{ display: 'flex', gap: '15px'}}>
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
                  </Box>
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
                    sx={{marginTop: '15px', marginBottom: '5px'}}
                  >
                    Registrar
                  </Button>
                </form>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </>
    </main>
  );
}
