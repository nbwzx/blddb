import ArrayTable from "@/components/ArrayTable";
import { NIGHTMARE_CODE_TYPES } from "@/utils/codeTypes";
import { Metadata } from "next";
import { notFound } from "next/navigation";
export const dynamicParams = false;
const codeTypes = NIGHTMARE_CODE_TYPES;

export async function generateStaticParams() {
  return codeTypes.map((codeType) => ({ codeType }));
}

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ codeType: string }>;
}>): Promise<Metadata> {
  const { codeType } = await params;
  if (!codeTypes.includes(codeType)) {
    return {
      title: "Error Page",
    };
  }
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
  if (!codeTypes.includes(codeType)) {
    return notFound();
  }
  return <ArrayTable codeType={codeType} />;
}
