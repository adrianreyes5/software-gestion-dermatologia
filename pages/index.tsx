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
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SnackBar from "@/components/snackbar";
import { 
  Box, 
  TextField,
  Tooltip
} from "@mui/material";

import axios from "@/config/interceptor";
import { Treatment, User, MessageResponse } from "@/utils/types";
import { useRouter } from "next/router";

export default function AvailableTreatments() {
  const [treatments, setTreatments] = React.useState<Treatment[]>([]);
  const [filter, setFilter] = React.useState<Treatment[]>([]);
  const [userData, setUserData] = React.useState<null | User>(null);
  const router = useRouter();
  const [snackbarState, setSnackbarState] = React.useState<MessageResponse>({
      message: "",
      open: false,
      type: "success",
  });
  
  React.useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get("/treatments"); 
        const data: Treatment[] = response.data;
        setTreatments(data);
        setFilter(data);
      } catch (error) {
        // Handle the error here
        console.error(error);
      }
    };

    getData();

    const storedUserData = localStorage.getItem('user');
    if (storedUserData) {
      const parsedUserData: User = JSON.parse(storedUserData);
      setUserData(parsedUserData);
      }
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const word = value.toLowerCase();
    if(word === ""){
      setFilter(treatments);
    } else {
      let filtered = filter.filter((treatment) =>
        treatment.name.toLowerCase().includes(word)
      );
      setFilter(filtered);
    }
  };

  const handleDelete = async (id: any) => {

    try {
      const response = await axios.delete(`/treatments/${id}`); 

      if(response.status == 200 ) {
        setSnackbarState({
          open: true,
          type: "success",
          message: "Eliminado exitosamente",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      // Handle the error here
      console.error(error);
    }
  };


  return (
    <>
      <CssBaseline />

      <main style={{position: "relative"}}>
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
              onChange={handleSearch}
            />
          </Box>
          {/* End hero unit */}
          <Grid container spacing={4}>
            {filter.map((treatment, index) => (
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
                  <CardActions sx={{display: "flex", justifyContent: "space-between" }}>
                    <Box sx={{ padding: "0 8px" }}>
                      <Button
                        size="small"
                        color="primary"
                        variant="contained"
                        onClick={() => router.push(`/treatments/details/${treatment.id}`)}
                        sx={{ marginRight: "10px" }}
                      >
                        View
                      </Button>
                      {userData && (userData.role_id) == 1 && (
                      <Button
                        size="small"
                        color="primary"
                        variant="outlined"
                        onClick={() => router.push(`/treatments/edit/${treatment.id}`)}
                      >
                        Edit
                      </Button>
                      )}
                    </Box>
                    {userData && (userData.role_id) == 1 && (
                      <Box>
                        <Button
                          size="small"
                          sx={{ padding: "5px 6px", minWidth: "30px" }}
                          onClick={() => handleDelete(treatment.id)}
                        >
                          <DeleteIcon color="error" />
                        </Button>
                      </Box>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        <Tooltip title="Nuevo tratamiento">
          <Fab color="primary" aria-label="add" sx={{ position: "fixed", bottom: "4%", right: "3%" }} onClick={() => router.push(`/treatments/create/`)}>
            <AddIcon />
          </Fab>
        </Tooltip>
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
    </>
  );
}
