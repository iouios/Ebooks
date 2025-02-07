import type { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import { ThemeProvider } from "../context/ThemeContext";
import Layout from "../app/layout"

export type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
  };

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout = Component.getLayout || ((page) => (
      <ThemeProvider>
        <Layout>{page}</Layout>
      </ThemeProvider>
    ));
  
    return getLayout(<Component {...pageProps} />);
  }