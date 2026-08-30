import Custom from "@/components/Custom";
import { Metadata } from "next";

export const metadata: Metadata = {
  other: {
    title_locales: "custom.edge",
  },
  // other metadata
};

const CustomEdgePage = () => {
  return <Custom codeType="edge" />;
};

export default CustomEdgePage;
