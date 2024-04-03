"use client";
import React, { useState, useEffect } from "react";
import { updateMetadata } from "./updateMetadata";
import { switchLocaleAction } from "./switchLocale";
import { useTranslation } from "@/i18n/client";

const LanguageToggler: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const langNames = {
    en: "English",
    "zh-CN": "简体中文",
    ja: "日本語",
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const updateLanguage = (newLang: string) => {
    toggleDropdown();
    switchLocaleAction(newLang);
    updateMetadata(document, t);
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
          backgroundImage: `url(/images/language/${(i18n.resolvedLanguage ?? "en").slice(0, 2)}.png)`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left bottom 4px",
          marginLeft: "4px",
        }}
        onClick={toggleDropdown}
      >
        {langNames[i18n.resolvedLanguage ?? "en"]}
      </div>
      <div
        className={"dropdown-content"}
        style={{ display: isDropdownOpen ? "block" : "none" }}
      >
        {Object.keys(langNames).map((langOther) => {
          if (langOther !== (i18n.resolvedLanguage ?? "en")) {
            return (
              <div
                className="status_circle"
                style={{
                  backgroundImage: `url(/images/language/${langOther.slice(0, 2)}.png)`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "left bottom 4px",
                  marginLeft: "4px",
                }}
                key={langOther}
                onClick={() => updateLanguage(langOther)}
              >
                {langNames[langOther]}
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
