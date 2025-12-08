"use client";

import { useState, useEffect } from "react";
import { Feature } from "@/types/feature";
import { useTranslation } from "@/i18n/client";
import Link from "next/link";

const SingleFeature = ({ feature }: { feature: Feature }) => {
  const urlRegex = /(\/[^\s]+)/gu;
  const [baseUrl, setBaseUrl] = useState("");
  useEffect(() => {
    setTimeout(() => {
      if (typeof window !== "undefined") {
        setBaseUrl(window.location.origin);
      }
    }, 1);
  }, []);
  const { t } = useTranslation();
  const { icon, title, paragraph } = feature;
  const parts = t(paragraph).split(urlRegex);
  return (
    <div className="w-full">
      <div className="wow fadeInUp" data-wow-delay=".15s">
        <div className="bg-primary/10 text-primary mb-10 flex h-[70px] w-[70px] items-center justify-center rounded-md">
          {icon}
        </div>
        <h3 className="mb-5 text-xl font-bold text-black sm:text-2xl lg:text-xl xl:text-2xl dark:text-white">
          {t(title)}
        </h3>
        <p className="text-body-color pr-[10px] text-base leading-relaxed font-medium">
          {parts.map((part: string, index: number) => {
            if (urlRegex.test(part)) {
              return (
                <Link
                  key={index}
                  href={part}
                  className="hover:text-primary underline"
                  passHref
                >
                  {baseUrl + part}
                </Link>
              );
            }
            return part;
          })}
        </p>
      </div>
    </div>
  );
};

export default SingleFeature;
