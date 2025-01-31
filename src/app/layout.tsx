import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { Inter } from "next/font/google";
import React from "react";
import "node_modules/react-modal-video/css/modal-video.css";
import "../styles/index.css";
import { Providers } from "./providers";
import { LocaleProvider } from "./localeProvider";
import { getLocale } from "../i18n/server";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = getLocale();
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
            <Header />
            {children}
            <ScrollToTop />
          </LocaleProvider>
        </Providers>
      </body>
    </html>
  );
}
