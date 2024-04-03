import Code from "@/components/Code";
import { Metadata } from "next";

export const metadata: Metadata = {
  description: "This is Blog Details Page for Startup Nextjs Template",
  other: {
    title_locales: "code.title",
  },
  // other metadata
};

const CodePage = () => {
  return <Code cubeSize={3} />;
};

export default CodePage;
