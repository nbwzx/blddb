import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { Inter } from "next/font/google";
import React from "react";
import "../styles/index.css";
import { Providers } from "./providers";
import { LocaleProvider } from "./localeProvider";
import { getLocale } from "../i18n/server";
import ErrorBoundary from "./ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

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
        className={`bg-[#FCFCFC] dark:bg-gray-dark ${inter.className}`}
      >
        <Providers>
          <LocaleProvider value={locale}>
            <ErrorBoundary>
              <Header />
              {children}
              <ScrollToTop />
            </ErrorBoundary>
          </LocaleProvider>
        </Providers>
      </body>
    </html>
  );
}
