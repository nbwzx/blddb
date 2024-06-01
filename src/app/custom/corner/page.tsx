import Custom from "@/components/Custom";
import { Metadata } from "next";

export const metadata: Metadata = {
  other: {
    title_locales: "custom.title",
  },
  // other metadata
};

const CustomPage = () => {
  return <Custom />;
};

export default CustomPage;
