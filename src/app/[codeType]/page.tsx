import BLD from "@/components/BLD";

export const dynamicParams = false;

export async function generateStaticParams() {
  const codeTypes = ["corner", "edge", "parity", "ltct"];
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
  return <BLD codeType={codeType} />;
}
