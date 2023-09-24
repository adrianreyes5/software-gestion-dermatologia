import { useRouter } from "next/router";

import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { Box, TextField, Paper, Typography, MenuItem } from "@mui/material";

import React, { useEffect } from "react";
import { handleError } from "@/utils/response-handler";
import { MessageResponse } from "@/utils/types";

import axios from "../../src/config/interceptor";
import LoadingButton from "@/components/loading-button";
import SnackBar from "@/components/snackbar";

import { getSurveyQuestions } from "@/api/survey";

export type Question = {
  question: string;
  answer: string;
};
export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = React.useState<boolean>(false);

  const [questions, setQuestions] = React.useState<Question[]>([]);

  const [snackbarState, setSnackbarState] = React.useState<MessageResponse>({
    message: "",
    open: false,
    type: "success",
  });

  const getQuestions = async () => {
    const response = await getSurveyQuestions();

    const data = response.data.map((item: any) => ({
      question: item.question,
      answer: "No",
    }));

    setQuestions(data);
  };

  useEffect(() => {
    getQuestions();
  }, []);

  const onSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `/survey/${router.query?.id}`,
        questions
      );

      if (handleError(response.status)) {
        throw new Error(response.data?.message);
      }

      const { data } = response.data;
      if (data.id) {
        setSnackbarState({
          open: true,
          type: "success",
          message: "Encuesta registrada exitosamente",
        });
        setTimeout(() => {
          router.push("/appointments");
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

  const handleAnswers = (e: any, question: string) => {
    setQuestions((prev) => {
      const data = prev.map((item) => {
        if (item.question === question) {
          return {
            ...item,
            answer: e,
          };
        }

        return item;
      });

      return data;
    });
  };

  console.log(questions);

  return (
    <main>
      <>
        <CssBaseline />
        <Container component="main" maxWidth="sm">
          <Grid container spacing={2} my={10}>
            <Grid item xs={12} sm={12}>
              <Box textAlign="center" mb={3}>
                <Typography variant="h4">Encuesta</Typography>
              </Box>
              <Paper sx={{ padding: "20px" }}>
                {questions.map((question, i) => (
                  <Box key={i} mt={2} mb={4}>
                    <React.Fragment>
                      <TextField
                        id="outlined-select-currency"
                        select
                        label={question.question}
                        defaultValue="No"
                        fullWidth
                        onChange={(e) =>
                          handleAnswers(e.target.value, question.question)
                        }
                      >
                        <MenuItem value="Si">Si</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </TextField>
                    </React.Fragment>
                  </Box>
                ))}

                {loading ? (
                  <LoadingButton sx={{ marginTop: "15px" }} />
                ) : (
                  <Button
                    onClick={() => onSubmit()}
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: "15px", marginBottom: "5px" }}
                  >
                    Enviar
                  </Button>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </>

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
