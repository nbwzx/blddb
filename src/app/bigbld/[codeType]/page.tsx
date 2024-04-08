import Bigbld from "@/components/Bigbld";

export const dynamicParams = false;

export async function generateStaticParams() {
  const bigbldCodeTypes = ["wing", "xcenter", "tcenter", "midge"];
  return bigbldCodeTypes.map((codeType) => ({ codeType }));
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
  return <Bigbld codeType={codeType} />;
}
