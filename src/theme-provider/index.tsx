import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#ce7777",
    },
    secondary: {
      main: "#e8c4c4",
      contrastText: '#2B3A55',
    },
    // info: {
    //   main: "#2b3a55",
    // },
    // success: {
    //   main: "#e8c4c4",
    // },
    background: {
      paper: '#faf1f1',
    },
    text: {
      primary: '#76787a',
      secondary: '#2B3A55',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {},
    },
  },
});
