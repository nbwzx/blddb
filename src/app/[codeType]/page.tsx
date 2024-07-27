import BLD from "@/components/BLD";
import Parity from "@/components/Parity";

export const dynamicParams = false;

export async function generateStaticParams() {
  const codeTypes = ["corner", "edge", "parity"];
  return codeTypes.map((codeType) => ({ codeType }));
}

export async function generateMetadata({
  params,
}: {
  params: { codeType: string };
}) {
  const { codeType } = params;
  return {
    other: {
      title_locales: `${codeType}.title`,
    },
    // other metadata
  };
}

export default function Page({ params }: { params: { codeType: string } }) {
  const { codeType } = params;
  if (codeType === "parity") {
    return <Parity codeType={codeType} />;
  }
  return <BLD codeType={codeType} />;
}
