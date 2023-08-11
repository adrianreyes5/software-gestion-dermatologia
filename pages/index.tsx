import * as React from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Box, TextField } from "@mui/material";

// styles
import axios from "@/config/interceptor";

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// TODO remove, this demo shouldn't need to reset the theme.

export default function AvailableTreatments() {
  React.useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get("/treatments"); // Replace with your API endpoint

        // Handle the response data here
        console.log(response.data);
      } catch (error) {
        // Handle the error here
        console.error(error);
      }
    };

    getData();
  }, []);

  return (
    <>
      <CssBaseline />

      <main>
        {/* Hero unit */}

        <Container sx={{ py: 5 }} maxWidth="md">
          <Box mb={4} textAlign="center">
            <Typography variant="h4" color="primary">
              Procedimientos disponibles
            </Typography>

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="search"
              label="Buscar"
              type="text"
              id="search"
            />
          </Box>
          {/* End hero unit */}
          <Grid container spacing={4}>
            {cards.map((card) => (
              <Grid item key={card} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    paddingBottom: "15px",
                  }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      // 16:9
                      pt: "56.25%",
                    }}
                    image="https://source.unsplash.com/random?wallpapers"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="h2"
                      color="primary"
                    >
                      Heading
                    </Typography>
                    <Typography>
                      This is a media card. You can use this section to describe
                      the content.
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ padding: "0 15px" }}>
                    <Button
                      size="small"
                      color="primary"
                      variant="contained"
                      href="/treatments/details"
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      color="primary"
                      variant="outlined"
                      href="/treatments/edit"
                    >
                      Edit
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </>
  );
}
