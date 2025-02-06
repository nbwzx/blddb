import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  other: {
    title_locales: "title",
  },
  // other metadata
};

const Page = () => {
  return <Home />;
};

export default Page;
