import { theme } from "@/theme-provider";
import { ThemeProvider } from "@mui/material";
import dayjs from "dayjs";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {

  dayjs.locale('es');

  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />;
    </ThemeProvider>
  );
}
