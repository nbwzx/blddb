import Corner from "@/components/Corner";
import { Metadata } from "next";

export const metadata: Metadata = {
  other: {
    title_locales: "corner.title",
  },
  // other metadata
};

const CornerPage = () => {
  return <Corner />;
};

export default CornerPage;
