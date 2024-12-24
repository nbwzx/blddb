import Parity from "@/components/Parity";
import { Metadata } from "next";

export const metadata: Metadata = {
  other: {
    title_locales: "parity.title",
  },
  // other metadata
};

const ParityPage = () => {
  return <Parity codeType={"parity"} />;
};

export default ParityPage;
