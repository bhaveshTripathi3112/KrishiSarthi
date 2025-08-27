import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./i18n/en.json";
import hi from "./i18n/hi.json";
import gu from "./i18n/gu.json";
import mr from "./i18n/mr.json";
import pa from "./i18n/pa.json";
import ta from "./i18n/ta.json";
import te from './i18n/te.json';
import hy from './i18n/hy.json';
import hr from './i18n/hr.json';
import rj from './i18n/rj.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      gu: { translation: gu },
      mr: { translation: mr },
      pa: { translation: pa },
      ta: { translation: ta },
      te: { translation: te },
      hy: { translation: hy },
      hr: { translation: hr },
      rj: { translation: rj }
    },
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;
