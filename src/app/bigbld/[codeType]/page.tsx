import BLD from "@/components/BLD";

export const dynamicParams = false;

export async function generateStaticParams() {
  const bigbldCodeTypes = ["wing", "xcenter", "tcenter", "midge"];
  return bigbldCodeTypes.map((codeType) => ({ codeType }));
}

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ codeType: string }>;
}>) {
  const { codeType } = await params;
  return {
    other: {
      title_locales: `${codeType}.title`,
    },
    // other metadata
  };
}

export default async function Page({
  params,
}: Readonly<{
  params: Promise<{ codeType: string }>;
}>) {
  const { codeType } = await params;
  return <BLD codeType={codeType} />;
}
