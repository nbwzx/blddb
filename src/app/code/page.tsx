import Code from "@/components/Code";
import { Metadata } from "next";

export const metadata: Metadata = {
  other: {
    title_locales: "code.title",
  },
  // other metadata
};

const CodePage = () => {
  return <Code cubeSize={3} />;
};

export default CodePage;
