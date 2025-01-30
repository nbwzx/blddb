import ScrollUp from "@/components/Common/ScrollUp";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { Metadata } from "next";
import React from "react";
import Script from "next/script";

export const metadata: Metadata = {
  other: {
    title_locales: "title",
  },
  // other metadata
};

export default function Home() {
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
