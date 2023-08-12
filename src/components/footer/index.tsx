import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import CardMedia from "@mui/material/CardMedia";
import { Facebook, Instagram } from "@mui/icons-material";
import { Box } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#e8c4c4",
        p: 6,
        pb: 3,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={1}>
          <Grid item xs={12} md={9}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                textAlign: { xs: "center", md: "left" },
                marginBottom: { xs: "20px", md: "0" },
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Contáctame
              </Typography>
              <Typography variant="body2" color="text.primary" mb={1}>
                Email: neiramon@hotmail.com
              </Typography>
              <Typography variant="body2" color="text.primary" mb={1}>
                Telefono: +58 414-9775114
              </Typography>
              <Typography variant="body2" color="text.primary" mb={1}>
                Ubicacion: Calle 9 Carrera 18, Barrio Obrero, San Cristobal
              </Typography>
              <Link
                href="https://www.instagram.com/doctoraneiramoncada/"
                color="text.primary"
                sx={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: { xs: "center", md: "left" } }}
              >
                <Instagram /> 
                <Typography variant="body2" color="text.primary" sx={{ marginLeft: '2px' }}>
                  @doctoraneiramoncada
                </Typography>
              </Link>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              display: "flex",
              textAlign: { xs: "center", md: "left" },
              marginTop: { xs: "20px", md: "0" },
              justifyContent: "center"
            }}
          >
            <CardMedia
              component="img"
              image="/images/logo2.png"
              alt="Logo"
              sx={{ mr: 1, width: "100%", maxWidth: "220px", objectFit: "contain", display: "flex", justifyContent: { xs: "center", md: "end" }}}
            />
          </Grid>
        </Grid>
        <Box mt={5}>
          <Typography variant="body2" color="text.primary" align="center">
            {"Copyright © Consultorio Dra. Neira "}
            {new Date().getFullYear()}
            {"."}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
