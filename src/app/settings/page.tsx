import Settings from "@/components/Settings";
import { Metadata } from "next";

export const metadata: Metadata = {
  other: {
    title_locales: "settings.title",
  },
  // other metadata
};

const SettingsPage = () => {
  return <Settings />;
};

export default SettingsPage;
