import Edge from "@/components/Edge";
import { Metadata } from "next";

export const metadata: Metadata = {
  other: {
    title_locales: "edge.title",
  },
  // other metadata
};

const EdgePage = () => {
  return <Edge />;
};

export default EdgePage;
