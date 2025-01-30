"use client";

import { Feature } from "@/types/feature";
import { useTranslation } from "@/i18n/client";
import React from "react";

const SingleFeature = ({ feature }: { feature: Feature }) => {
  const urlRegex = /\[(https?:\/\/[^\s]+)\]/gu;
  const { t } = useTranslation();
  const { icon, title, paragraph } = feature;
  return (
    <div className="w-full">
      <div className="wow fadeInUp" data-wow-delay=".15s">
        <div className="mb-10 flex h-[70px] w-[70px] items-center justify-center rounded-md bg-primary bg-opacity-10 text-primary">
          {icon}
        </div>
        <h3 className="mb-5 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
          {t(title)}
        </h3>
        <p
          className="pr-[10px] text-base font-medium leading-relaxed text-body-color"
          key={paragraph}
          dangerouslySetInnerHTML={{
            __html: t(paragraph).replace(urlRegex, (match, p1) => {
              return `<a href="${p1}" target="_blank" rel="noopener noreferrer" style="text-decoration: underline;" onmouseover="this.classList.add('text-primary')" 
                     onmouseout="this.classList.remove('text-primary')">${p1}</a>`;
            }),
          }}
        ></p>
      </div>
    </div>
  );
};

export default SingleFeature;
