// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { enUS, es } from "date-fns/locale";

const locales = { en: enUS, es };

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "es",
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
export { locales };
