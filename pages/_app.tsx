import { theme } from "@/theme-provider";
import { ThemeProvider } from "@mui/material";
import dayjs from "dayjs";
import type { AppContext, AppProps } from "next/app";
import NavBar from "@/components/navbar";
import React from "react";
import { getCookie } from "cookies-next";
import '../src/styles/global.scss';
import Footer from "@/components/footer";

const protectedRoutes = ["/", "/appointments", "/profile"];

export default function App({ Component, pageProps }: AppProps) {
  dayjs.locale("es");

  return (
    <ThemeProvider theme={theme}>
      <NavBar />
      <Component {...pageProps} />
      <Footer />
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
