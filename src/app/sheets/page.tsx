import Sheets from "@/components/Sheets";
import { Metadata } from "next";

export const metadata: Metadata = {
  other: {
    title_locales: "sheets.title",
  },
  // other metadata
};

const SheetsPage = () => {
  return <Sheets />;
};

export default SheetsPage;
