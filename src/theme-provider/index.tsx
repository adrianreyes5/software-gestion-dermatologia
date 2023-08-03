import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#ce7777",
    },
    secondary: {
      main: "#e8c4c4",
    },
    info: {
      main: "#2b3a55",
    },
    success: {
      main: "#e8c4c4",
    },
    background: {
      paper: "rgba(242,229,229,0.5)",
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {},
    },
  },
});
