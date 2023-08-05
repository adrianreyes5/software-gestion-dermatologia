import { theme } from "@/theme-provider";
import { ThemeProvider } from "@mui/material";
import dayjs from "dayjs";
import type { AppProps } from "next/app";
import NavBar from "@/components/navbar";

export default function App({ Component, pageProps }: AppProps) {

  dayjs.locale('es');

  return (
    <ThemeProvider theme={theme}>
      <NavBar />
      <Component {...pageProps} />;
    </ThemeProvider>
  );
}
