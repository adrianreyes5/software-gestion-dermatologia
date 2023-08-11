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
import { 
  Box, 
  TextField,
} from "@mui/material";

// styles
import axios from "@/config/interceptor";

interface Treatment {
  "id": number;
  "name": string;
  "description": string;
  "cost": number;
  "duration": number;
  "image-url": string;
  "protocols": string;
}

export default function AvailableTreatments() {
  const [treatments, setTreatments] = React.useState<Treatment[]>([]);
  
  React.useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get("/treatments"); // Replace with your API endpoint

        // Handle the response data here
        console.log(response.data);
        const data: Treatment[] = response.data;
        setTreatments(data);
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
        <Container sx={{ py: 10 }} maxWidth="md">
          <Box mb={4} textAlign="center">
            <Typography variant="h4" color="primary">
              Procedimientos disponibles
            </Typography>

            <TextField
              variant="outlined"
              size="small"
              required
              fullWidth
              name="search"
              label="Buscar"
              type="text"
              id="search"
              sx={{ marginTop: "25px" }}
            />
          </Box>
          {/* End hero unit */}
          <Grid container spacing={4}>
            {treatments.map((treatment, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
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
                    image={treatment["image-url"]}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="h2"
                      color="primary"
                    >
                      {treatment.name}
                    </Typography>
                    <Typography>
                      {treatment.description.substring(0, 60) + "..."}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ padding: "0 15px" }}>
                    <Button
                      size="small"
                      color="primary"
                      variant="contained"
                      href={`/treatments/details/${treatment.id}`}
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
