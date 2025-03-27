import BLD from "@/components/BLD";
import { notFound } from "next/navigation";
export const dynamicParams = false;
const codeTypes = ["corner", "edge", "parity", "ltct", "twists", "flips"];

export async function generateStaticParams() {
  return codeTypes.map((codeType) => ({ codeType }));
}

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ codeType: string }>;
}>) {
  const { codeType } = await params;
  if (!codeTypes.includes(codeType)) {
    return {
      title: "Error Page",
    };
  }
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
  if (!codeTypes.includes(codeType)) {
    return notFound();
  }
  return <BLD codeType={codeType} />;
}
