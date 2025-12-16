import Commutator from "@/components/Commutator";
import { Metadata } from "next";

export const metadata: Metadata = {
  other: {
    title_locales: "commutator.title",
  },
  // other metadata
};

const CommutatorPage = () => {
  return <Commutator />;
};

export default CommutatorPage;
