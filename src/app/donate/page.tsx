import Donate from "@/components/Donate";
import { Metadata } from "next";

export const metadata: Metadata = {
  other: {
    title_locales: "donate.title",
  },
  // other metadata
};

const DonatePage = () => {
  return <Donate />;
};

export default DonatePage;
