"use client";

import React from "react";
import Image from "next/image";
import { useTranslation } from "@/i18n/client";
import PageSection from "@/components/PageSection";

const Donate = () => {
  const { t } = useTranslation();

  return (
    <PageSection title={t("donate.title")}>
      <div className="text-xl text-black dark:text-white">
        {t("donate.heading")}
        <br />
        {t("donate.description")}
        <br />
        {t("donate.paypalText")}{" "}
        <a
          href="https://www.paypal.com/paypalme/nbwzx"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary underline"
        >
          PayPal
        </a>
        {t("donate.period")}
        <br />
        {t("donate.qrText")}
        <div className="mt-4 mb-4 flex gap-4">
          <Image
            src="/images/donate/Alipay.png"
            alt="Alipay"
            height={200}
            width={300}
            style={{ width: "auto", height: "300px" }}
            loading="eager"
          />
          <Image
            src="/images/donate/Wechatpay.png"
            alt="Wechatpay"
            height={225}
            width={300}
            style={{ width: "auto", height: "300px" }}
            loading="eager"
            className="w-auto"
          />
        </div>
        {t("donate.thankYou")}
      </div>
    </PageSection>
  );
};

export default Donate;
