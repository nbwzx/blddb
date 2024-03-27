import React, { useState, useEffect } from "react";
import i18n from "next-i18next.config";
import { useTranslation } from "react-i18next";
import { updateMetadata } from "./updateMetadata";

const LanguageToggler: React.FC = () => {
  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const langNames = {
    en: "English",
    "zh-CN": "简体中文",
    ja: "日本語",
  };

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const [lang, setLang] = useState("en"); // Replace with the desired default language

  const updateLanguage = (newLang: string) => {
    setLang(newLang);
    toggleDropdown();
    handleLanguageChange(newLang);
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
          backgroundImage: `url(/images/language/${lang.slice(0, 2)}.png)`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left bottom 4px",
          marginLeft: "4px",
        }}
        onClick={toggleDropdown}
      >
        {langNames[lang]}
      </div>
      <div
        className={"dropdown-content"}
        style={{ display: isDropdownOpen ? "block" : "none" }}
      >
        {Object.keys(langNames).map((langOther) => {
          if (langOther !== lang) {
            return (
              <div
                className="status_circle"
                style={{
                  backgroundImage: `url(/images/language/${langOther.slice(0, 2)}.png)`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "left bottom 4px",
                  marginLeft: "4px",
                }}
                data-lang={langOther}
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
