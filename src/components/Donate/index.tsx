"use client";

import React from "react";
import Image from "next/image";
import { useTranslation } from "@/i18n/client";

const Donate = () => {
  const { t } = useTranslation();

  return (
    <section className="pb-[120px] pt-[100px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4 lg:w-10/12">
            <div>
              <h2 className="mb-8 text-center text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight">
                {t("donate.title")}
              </h2>
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
                  className="underline hover:text-primary"
                >
                  PayPal
                </a>
                {t("donate.period")}
                <br />
                {t("donate.qrText")}
                <div className="mb-4 mt-4 flex gap-4">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Donate;
