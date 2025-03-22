import Checker from "@/components/Checker";
import { Metadata } from "next";

export const metadata: Metadata = {
  other: {
    title_locales: "checker.title",
  },
  // other metadata
};

const CheckerPage = () => {
  return <Checker />;
};

export default CheckerPage;
