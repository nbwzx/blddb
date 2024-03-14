import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./public/locales/en.json";
import zhCN from "./public/locales/zh-CN.json";
import ja from "./public/locales/ja.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    "zh-CN": {
      translation: zhCN,
    },
    ja: {
      translation: ja,
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
