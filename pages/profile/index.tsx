import React from "react";
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
import { User, FormValues, UserData } from "@/utils/types";
import BackupIcon from '@mui/icons-material/Backup';
import dynamic from "next/dynamic";

const schema = yup
  .object({
    first_name: yup.string().required("Nombre es requerido"),
    last_name: yup.string().required("Apellido es requerido"),
    phone: yup.string(),
    address: yup.string(),
    birthday: yup.string(),
    email: yup
      .string()
      .email("Debe ser un correo electronico valido")
      .required("El correo es requerido"),
    password: yup.string(),
    confirm_password: yup
      .string()
      .oneOf([yup.ref("password")], "La contraseña no coincide"),
    "image-profile": yup.string().nullable(),
  });

const DatePicker = dynamic(() =>
  import("@mui/x-date-pickers/DatePicker").then((module) => module.DatePicker)
);

const defaultValues: UserData = {
  first_name: "",
  last_name: "",
  phone: "",
  address: "",
  birthday: dayjs(new Date()).format("YYYY-MM-DD"),
  email: "",
  password: "",
  confirm_password: "",
  "image-profile": "",
};

export default function Profile() {

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
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
    console.log('file', file)

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  const setInitialValues = (data: any) => {
    const parsedUserData: User = JSON.parse(data as string);

    if (data) {
      const userDataValues: FormValues = JSON.parse(data);

      Object.keys(userDataValues).forEach((fieldName) => {
        const key = fieldName as keyof FormValues;
        if(key === 'birthday') {
          setValue("birthday", dayjs(new Date(userDataValues[key])).format("YYYY-MM-DD"));
        } else {
          setValue(key, userDataValues[key]);
        }
      });
      setImageUrl(parsedUserData["image-profile"] as string);
      setUserData(parsedUserData);
    }
  }

  const handleInitialData = () => {
    const storedUserData = localStorage.getItem('user');
    setInitialValues(storedUserData);
  };

  React.useEffect(() => {
    const storedUserData = localStorage.getItem('user');
    setInitialValues(storedUserData);
  }, []);

  const handleDateChange = (date: any) => {
    setValue("birthday", dayjs(date).format("YYYY-MM-DD"));
  };

  const onSubmit = async (formData: any) => {
    setLoading(true);
    try {
      console.log('formData', formData)
      formData['image-profile'] = imageUrl;
      const response = await axios.put(`/user/${userData?.id}`, formData);
      console.log('response', response)
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} p={2}>
              <Grid item xs={12} sm={6} display="flex" justifyContent="center" alignItems="start">
                <Stack direction="column" alignItems="center" spacing={2} sx={{ width: '100%'}}>
                  {imageUrl ? 
                    <CardMedia
                      component="img"
                      image={imageUrl}
                      alt="Uploaded Image"
                      sx={{ display: "flex", width: "100%", maxWidth: "300px", borderRadius: "50%", objectFit: "cover", padding: "15px", height: "300px" }}
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
                      helperText={errors?.first_name?.message as string}
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
                      helperText={errors?.last_name?.message as string}
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
                    helperText={errors?.email?.message as string}
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
                      required={watch("password") !== ""}
                      error={!!errors?.confirm_password?.message}
                    />
                  </Box>
              </Grid>
            </Grid>
            <Box
              textAlign="center"
              sx={{ display: "flex", gap: "45px", width: "100%", maxWidth: "500px", margin: "0 auto" }}
              px={2}
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
          </form>
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
