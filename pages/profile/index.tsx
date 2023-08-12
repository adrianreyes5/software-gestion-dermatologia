import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Box, TextField, Paper, Stack, CardMedia } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import axios from "../../src/config/interceptor";
import { MessageResponse } from "@/utils/types";
import { handleError } from "@/utils/response-handler";
import SnackBar from "@/components/snackbar";
import LoadingButton from "@/components/loading-button";
import { User, FormValues } from "@/utils/types";
import BackupIcon from '@mui/icons-material/Backup';
import dynamic from "next/dynamic";

const schema = yup
  .object({
    first_name: yup.string().required("Nombre es requerido"),
    last_name: yup.string().required("Apellido es requerido"),
    phone: yup.string().required("Teléfono es requerido"),
    address: yup.string().required("Dirección es requerido"),
    birthday: yup.string().required("Fecha de nacimiento es requerido"),
    email: yup
      .string()
      .email("Debe ser un correo electronico valido")
      .required("El correo es requerido"),
    password: yup.string().required("La contraseña es requerida"),
    confirm_password: yup
      .string()
      .required("Confirmar contraseña es requerido")
      .oneOf([yup.ref("password")], "La contraseña no coincide"),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

const DatePicker = dynamic(() =>
  import("@mui/x-date-pickers/DatePicker").then((module) => module.DatePicker)
);

export default function Profile() {

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      birthday: dayjs(new Date()).format("DD/MM/YYYY"),
    },
  });

  const [snackbarState, setSnackbarState] = React.useState<MessageResponse>({
    message: "",
    open: false,
    type: "success",
  });
  const [loading, setLoading] = React.useState<boolean>(false);
  const [userData, setUserData] = React.useState<null | User>(null);
  const [imageUrl, setImageUrl] = React.useState<null | string>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleInitialData = async () => {
    const storedUserData = localStorage.getItem('user');
    if (storedUserData) {
      const userDataValues: FormValues = JSON.parse(storedUserData);

      Object.keys(userDataValues).forEach((fieldName) => {
        const key = fieldName as keyof FormValues;
        if(key === 'birthday') {
          setValue("birthday", dayjs(new Date(userDataValues[key])).format("MM/DD/YYYY"));
        } else {
          setValue(key, userDataValues[key]);
        }
      });
    }
    // try {
    //   const response = await axios.get(`/users?id=${userData?.id}`); 
    //   const data: User = response.data;
    //   setUserData(data);
    // } catch (error) {
    //   // Handle the error here
    //   console.error(error);
    // }
  };

  React.useEffect(() => {
    const storedUserData = localStorage.getItem('user');
    if (storedUserData) {
      const parsedUserData: User = JSON.parse(storedUserData);
      const userDataValues: FormValues = JSON.parse(storedUserData);
      console.log('parsedUserData', parsedUserData)

      Object.keys(userDataValues).forEach((fieldName) => {
        const key = fieldName as keyof FormValues;
        if(key === 'birthday') {
          setValue("birthday", dayjs(new Date(userDataValues[key])).format("MM/DD/YYYY"));
        } else {
          setValue(key, userDataValues[key]);
        }
      });
      setUserData(parsedUserData);
    }
  }, []);

  const handleDateChange = (date: any) => {
    setValue("birthday", dayjs(date).format("DD/MM/YYYY"));
  };

  const onSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      const response = await axios.put(`/user`, formData);

      if (handleError(response.status)) {
        throw new Error(response.data?.Error);
      }

      const { data } = response.data;
      if(data.id) {
        setSnackbarState({
          open: true,
          type: "success",
          message: "Actualizado exitosamente",
        });
        localStorage.setItem("user", JSON.stringify(data));
      }

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
      <Container sx={{ py: 10 }} maxWidth="lg">
        <Paper sx={{ padding: "20px" }}>
          <Grid container spacing={2} p={2}>
            <Grid item xs={12} sm={6} display="flex" justifyContent="center" alignItems="start">
              <Stack direction="column" alignItems="center" spacing={2} sx={{ width: '100%'}}>
                {imageUrl ? 
                  <CardMedia
                    component="img"
                    image={imageUrl}
                    alt="Uploaded Image"
                    sx={{ display: "flex", width: "100%", maxWidth: "300px", borderRadius: "50%", objectFit: "cover", padding: "15px" }}
                  /> :
                  <AccountCircleIcon
                    sx={{ display: "flex", width: "100%", maxWidth: "300px", height: "auto" }}
                    color="primary"
                  />}
                <label htmlFor="upload-image">
                  <Button variant="contained" component="span" startIcon={<BackupIcon />}>
                    Upload
                  </Button>
                  <input
                    id="upload-image"
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleFileUpload}
                  />
                </label>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h4" color="primary">
                Mi perfil
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ display: "flex", gap: "15px" }}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="first_name"
                    label="Nombre"
                    type="text"
                    autoComplete="Jhon"
                    {...register("first_name")}
                    error={!!errors?.first_name?.message}
                    helperText={errors?.first_name?.message}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Apellido"
                    type="text"
                    id="last_name"
                    autoComplete="Doe"
                    {...register("last_name")}
                    error={!!errors?.last_name?.message}
                    helperText={errors?.last_name?.message}
                  />
                </Box>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Correo electrónico"
                  autoComplete="email"
                  type="email"
                  autoFocus
                  {...register("email")}
                  error={!!errors?.email?.message}
                  helperText={errors?.email?.message}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="phone"
                  label="Nro de teléfono"
                  autoComplete="+12345678"
                  {...register("phone")}
                  error={!!errors?.phone?.message}
                  helperText={errors?.phone?.message}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="address"
                  label="Dirección"
                  autoComplete="Example address"
                  {...register("address")}
                  error={!!errors?.address?.message}
                  helperText={errors?.address?.message}
                />

                <Box mt={1} width="100% ">
                {typeof window !== "undefined" && (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      defaultValue={dayjs(userData?.birthday)}
                      className="full-w"
                      onChange={handleDateChange}
                    />
                  </LocalizationProvider>
                )}
                </Box>
                <Box sx={{ display: "flex", gap: "15px" }}>
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
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Confirmar Contraseña"
                    type="password"
                    id="confirm_password"
                    autoComplete="current-password"
                    {...register("confirm_password")}
                    error={!!errors?.confirm_password?.message}
                    helperText={errors?.confirm_password?.message}
                  />
                </Box>
              </form>
              <Box
                textAlign="center"
                mt={2}
                sx={{ display: "flex", gap: "55px" }}
              >
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  sx={{ marginTop: "15px" }}
                  onClick={handleInitialData}
                >
                  Cancelar
                </Button>

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
                    Guardar
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>
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
