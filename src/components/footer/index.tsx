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
          <Grid item xs={12} md={3}>
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
              <Typography variant="body2" color="text.primary">
                123 Main Street, Anytown, USA
              </Typography>
              <Typography variant="body2" color="text.primary">
                Email: info@example.com
              </Typography>
              <Typography variant="body2" color="text.primary">
                Phone: +1 234 567 8901
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <CardMedia
              component="img"
              image="/images/logo2.png"
              alt="Logo"
              sx={{ mr: 1, width: "100%", maxWidth: "220px" }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              display: "flex",
              flexDirection: "column",
              textAlign: { xs: "center", md: "left" },
              marginTop: { xs: "20px", md: "0" },
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Sígueme
            </Typography>
            <div>
              <Link href="https://www.facebook.com/" color="text.secondary">
                <Facebook />
              </Link>
              <Link
                href="https://www.instagram.com/"
                color="text.secondary"
                sx={{ pl: 1, pr: 1 }}
              >
                <Instagram />
              </Link>
            </div>
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
