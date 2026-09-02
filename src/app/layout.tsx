import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import React from "react";
import "../styles/index.css";
import { Providers } from "./providers";
import { LocaleProvider } from "./localeProvider";
import { getLocale, loadLocaleResources } from "../i18n/server";
import { I18nSeed } from "./i18nSeed";
import ErrorBoundary from "./ErrorBoundary";
import { AppProvider } from "../components/context";
import MultiRouteWrapper from "../components/Wrapper";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const initialResources = await loadLocaleResources(locale);
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
        <I18nSeed locale={locale} resources={initialResources} />
        <Providers>
          <LocaleProvider value={locale}>
            <ErrorBoundary>
              <AppProvider>
                <MultiRouteWrapper>
                  <Header />
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
