import ArrayTable from "@/components/ArrayTable";

export const dynamicParams = false;

export async function generateStaticParams() {
  const codeTypes = [
    "corner",
    "edge",
    "2c2c",
    "2e2e",
    "2flips",
    "2twists",
    "3twists",
    "4flips",
    "5style",
    "ltct",
    "parity",
  ];
  return codeTypes.map((codeType) => ({ codeType }));
}

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ codeType: string }>;
}>) {
  const { codeType } = await params;
  return {
    other: {
      title_locales: `nightmare.${codeType}`,
    },
    // other metadata
  };
}

export default async function TablePage({
  params,
}: Readonly<{
  params: Promise<{ codeType: string }>;
}>) {
  const { codeType } = await params;
  return <ArrayTable codeType={codeType} />;
}
