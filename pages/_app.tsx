import { theme } from "@/theme-provider";
import { ThemeProvider } from "@mui/material";
import dayjs from "dayjs";
import type { AppContext, AppProps } from "next/app";
import NavBar from "@/components/navbar";
import React from "react";
import { getCookie } from "cookies-next";
import "../src/styles/general.scss";

const protectedRoutes = ["/"];

export default function App({ Component, pageProps }: AppProps) {
  dayjs.locale("es");

  return (
    <ThemeProvider theme={theme}>
      <NavBar />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

App.getInitialProps = async (context: AppContext) => {
  const { ctx } = context;

  const token = getCookie("token", { req: ctx.req, res: ctx.res });

  if (!token && protectedRoutes.includes(ctx.pathname)) {
    ctx?.res?.writeHead(302, {
      Location: "/login",
    });
    ctx?.res?.end();
  }

  return {
    props: {},
  };
};
