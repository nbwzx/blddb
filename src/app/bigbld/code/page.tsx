import Code from "@/components/Code";
import { Metadata } from "next";

export const metadata: Metadata = {
  description: "This is Blog Details Page for Startup Nextjs Template",
  other: {
    title_locales: "code.BigBLD",
  },
  // other metadata
};

const CodePage = () => {
  return <Code cubeSize={5} />;
};

export default CodePage;
