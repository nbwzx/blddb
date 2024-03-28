"use client";

import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { Inter } from "next/font/google";
import React from "react";
import "node_modules/react-modal-video/css/modal-video.css";
import "../styles/index.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />

      <body
        suppressHydrationWarning
        className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}
      >
        <div className="flex-wrapper ">
          <Providers>
            <Header />
            {children}
            <ScrollToTop />
          </Providers>
        </div>
      </body>
    </html>
  );
}

import { Providers } from "./providers";
