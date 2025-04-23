"use client";

import React, { useLayoutEffect } from "react";
import ScrollUp from "@/components/Common/ScrollUp";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import Script from "next/script";

export default function Home() {
  useLayoutEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js");
    }
  }, []);

  return (
    <>
      {process.env.NODE_ENV === "production" && (
        <React.Fragment>
          <Script
            id="next"
            async
            src={"https://www.googletagmanager.com/gtag/js?id=G-EGQN6HF7KE"}
          ></Script>
          <Script id="next">
            {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EGQN6HF7KE');`}
          </Script>
        </React.Fragment>
      )}
      <ScrollUp />
      <Hero />
      <Features />
      <Footer />
    </>
  );
}
