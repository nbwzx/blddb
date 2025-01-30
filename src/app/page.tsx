import ScrollUp from "@/components/Common/ScrollUp";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  other: {
    title_locales: "title",
  },
  // other metadata
};

export default function Home() {
  return (
    <>
      <ScrollUp />
      <Hero />
      <Features />
      <Footer />
    </>
  );
}
