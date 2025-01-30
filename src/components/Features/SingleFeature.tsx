"use client";

import { Feature } from "@/types/feature";
import { useTranslation } from "@/i18n/client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const SingleFeature = ({ feature }: { feature: Feature }) => {
  const urlRegex = /(\/[^\s]+)/gu;
  const [baseUrl, setBaseUrl] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, []);
  const { t } = useTranslation();
  const { icon, title, paragraph } = feature;
  const parts = t(paragraph).split(urlRegex);
  return (
    <div className="w-full">
      <div className="wow fadeInUp" data-wow-delay=".15s">
        <div className="mb-10 flex h-[70px] w-[70px] items-center justify-center rounded-md bg-primary bg-opacity-10 text-primary">
          {icon}
        </div>
        <h3 className="mb-5 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
          {t(title)}
        </h3>
        <p className="pr-[10px] text-base font-medium leading-relaxed text-body-color">
          {parts.map((part: string, index: number) => {
            if (urlRegex.test(part)) {
              return (
                <Link
                  key={index}
                  href={part}
                  className="underline hover:text-primary"
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
