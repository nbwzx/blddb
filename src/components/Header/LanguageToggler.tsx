"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "@/i18n/client";
import { useSetLocale } from "@/app/localeProvider";
import { Locales, FALLBACK_LOCALE } from "@/i18n/settings";

const langNames: Record<Locales, string> = {
  en: "English",
  "zh-CN": "简体中文",
  ja: "日本語",
};

const flagFile: Record<Locales, string> = {
  en: "en",
  "zh-CN": "zh",
  ja: "ja",
};

const LanguageToggler: React.FC = () => {
  const { i18n } = useTranslation();
  const setLocale = useSetLocale();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const currentLocale = (i18n.resolvedLanguage ?? FALLBACK_LOCALE) as Locales;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const updateLanguage = (newLang: string) => {
    toggleDropdown();
    setLocale(newLang as Locales);
  };

  const divRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!divRef.current?.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div ref={divRef} className="language">
      <div
        className="status_circle"
        style={{
          backgroundImage: `url(/images/language/${flagFile[currentLocale]}.png)`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left bottom 4px",
          marginLeft: "4px",
        }}
        onClick={toggleDropdown}
      >
        {langNames[currentLocale]}
      </div>
      <div
        className={"dropdown-content"}
        style={{ display: isDropdownOpen ? "block" : "none" }}
      >
        {Object.keys(langNames).map((langOther) => {
          if (langOther !== currentLocale) {
            return (
              <div
                className="status_circle"
                style={{
                  backgroundImage: `url(/images/language/${flagFile[langOther as Locales]}.png)`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "left bottom 4px",
                  marginLeft: "4px",
                }}
                key={langOther}
                onClick={() => updateLanguage(langOther)}
              >
                {langNames[langOther as Locales]}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default LanguageToggler;
