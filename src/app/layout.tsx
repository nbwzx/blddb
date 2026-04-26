import ScrollToTop from "@/components/ScrollToTop";
import React from "react";
import "../styles/index.css";
import { Providers } from "./providers";
import { LocaleProvider } from "./localeProvider";
import { getLocale } from "../i18n/server";
import ErrorBoundary from "./ErrorBoundary";
import { AppProvider } from "../components/context";
import MultiRouteWrapper from "../components/Wrapper";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  return (
    <html suppressHydrationWarning lang={locale}>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />

      <body
        suppressHydrationWarning
        className={"dark:bg-gray-dark bg-[#FCFCFC]"}
      >
        <Providers>
          <LocaleProvider value={locale}>
            <ErrorBoundary>
              <AppProvider>
                <MultiRouteWrapper>
                  {children}
                  <ScrollToTop />
                </MultiRouteWrapper>
              </AppProvider>
            </ErrorBoundary>
          </LocaleProvider>
        </Providers>
      </body>
    </html>
  );
}
