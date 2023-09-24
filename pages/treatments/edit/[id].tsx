import * as React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import {
    Grid,
    Container,
    Box,
    Button,
    Paper,
    TextField,
    Stack,
    CardMedia,
    Typography
} from "@mui/material";
import WestIcon from "@mui/icons-material/West";
import { useRouter } from "next/router";
import { MessageResponse, Treatment } from "@/utils/types";
import SnackBar from "@/components/snackbar";
import axios from "@/config/interceptor";
import BackupIcon from "@mui/icons-material/Backup";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import LoadingButton from "@/components/loading-button";
import { handleError } from "@/utils/response-handler";

const schema = yup.object({
    name: yup.string().required("Nombre es requerido"),
    description: yup.string().required("Descripcion es requerida"),
    duration: yup.number(),
    cost: yup.number(),
    protocols: yup.string(),
    "image-url": yup.string().nullable(),
});

const defaultValues: Treatment = {
    cost: 0,
    description: "description",
    duration: 0,
    id: 0,
    "image-url": "",
    name: "name",
    protocols: "protocols",
};

export default function AvailableTreatments() {
    const router = useRouter();
    const { id } = router.query;

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<any>({
        resolver: yupResolver(schema),
        defaultValues: defaultValues,
    });

    const [loading, setLoading] = React.useState(false);
    const [imageUrl, setImageUrl] = React.useState<null | string>(null);
    const [currenTreatment, setCurrenTreatment] = React.useState<null | Treatment>(null);
    const [snackbarState, setSnackbarState] = React.useState<MessageResponse>({
        message: "",
        open: false,
        type: "success",
    });

    React.useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(`/treatments/${id}`);
                const data: Treatment = response.data;

                setInitialValues(data);
            } catch (error) {
                console.error(error);
            }
        };

        getData();
    }, []);

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

    const setInitialValues = (data: any) => {
        const parsedTreatment: Treatment = data;

        if (data) {
            Object.keys(parsedTreatment).forEach((fieldName) => {
                const key = fieldName as keyof Treatment;
                setValue(key, parsedTreatment[key]);
            });
            setImageUrl(parsedTreatment["image-url"] as string);
            setCurrenTreatment(parsedTreatment);
        }
    };

    const onSubmit = async (formData: any) => {
        setLoading(true);

        try {
            formData["image-url"] = imageUrl;
            const response = await axios.put(`/treatments/${currenTreatment?.id}`, formData);
            if (handleError(response.status)) {
                throw new Error(response.data?.Error);
            }

            const { data } = response;

            if (data.id) {
                setSnackbarState({
                    open: true,
                    type: "success",
                    message: "Actualizado exitosamente",
                });
                setCurrenTreatment(data);
                setTimeout(() => {
                    window.location.href = `/treatments/details/${data.id}`;
                }, 1500);
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
        <div>
            <Container sx={{ py: 8 }} maxWidth="md">
                <Box mb={4} sx={{display: "flex", width: "100%"}}>
                    <Button
                        onClick={() => router.back()}
                        sx={{ cursor: "pointer", p: 0, justifyContent: "start", minWidth: "fit-content" }}
                    >
                        <WestIcon sx={{ fontSize: "35px", marginBottom: "5px" }} />
                    </Button>
                    <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        color="primary"
                        margin={"auto"}
                    >
                        Editar Procedimiento
                    </Typography>
                </Box>
                <Box my={1} textAlign="center">
                    <Paper sx={{ padding: "20px" }}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={4}>
                                <Grid item xs={6}>
                                    <Stack
                                        direction="column"
                                        alignItems="center"
                                        spacing={2}
                                        sx={{ width: "100%" }}
                                    >
                                        {imageUrl ? (
                                            <CardMedia
                                                component="img"
                                                image={imageUrl}
                                                alt="Uploaded Image"
                                                style={{ borderRadius: "10px", marginTop: "14px" }}
                                            />
                                        ) : (
                                            <AddPhotoAlternateIcon
                                                sx={{
                                                    display: "flex",
                                                    width: "100%",
                                                    maxWidth: "150px",
                                                    height: "auto",
                                                }}
                                                color="primary"
                                            />
                                        )}
                                        <label htmlFor="upload-image">
                                            <Button
                                                variant="contained"
                                                component="span"
                                                startIcon={<BackupIcon />}
                                            >
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
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        id="name"
                                        label="Nombre"
                                        type="text"
                                        {...register("name")}
                                        error={!!errors?.name?.message}
                                        helperText={errors?.name?.message as string}
                                    />

                                    <TextField
                                        variant="outlined"
                                        id="description"
                                        label="Descripción"
                                        margin="normal"
                                        multiline
                                        fullWidth
                                        rows={4}
                                        {...register("description")}
                                        error={!!errors?.description?.message}
                                        helperText={errors?.description?.message as string}
                                    />

                                    <TextField
                                        variant="outlined"
                                        id="protocols"
                                        label="Requisitos previos"
                                        margin="normal"
                                        multiline
                                        fullWidth
                                        rows={4}
                                        {...register("protocols")}
                                        error={!!errors?.protocols?.message}
                                        helperText={errors?.protocols?.message as string}
                                    />

                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        id="cost"
                                        label="Costo ($)"
                                        type="number"
                                        {...register("cost")}
                                        error={!!errors?.cost?.message}
                                        helperText={errors?.cost?.message as string}
                                    />

                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        id="duration"
                                        label="Duración (horas)"
                                        type="number"
                                        {...register("duration")}
                                        error={!!errors?.duration?.message}
                                        helperText={errors?.duration?.message as string}
                                    />

                                    <Box sx={{ m: 1, position: "relative" }}>
                                        {loading ? (
                                            <LoadingButton sx={{ marginTop: "15px" }} />
                                        ) : (
                                            <Button
                                                type="submit"
                                                size="medium"
                                                variant="contained"
                                                color="primary"
                                                sx={{ marginTop: "15px" }}
                                            >
                                                Actualizar
                                            </Button>
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Box>
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
        </div>
    );
}
