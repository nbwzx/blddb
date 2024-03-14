import Corner from "@/components/Corner";
import { Metadata } from "next";

export const metadata: Metadata = {
  description: "This is Blog Details Page for Startup Nextjs Template",
  other: {
    title_locales: "corner.title",
  },
  // other metadata
};

const CornerPage = () => {
  return <Corner />;
};

export default CornerPage;
