import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from './locales/en/translation.json';
import taTranslations from './locales/ta/translation.json';
import hiTranslations from './locales/hi/translation.json';
import teTranslations from './locales/te/translation.json';
import mlTranslations from './locales/ml/translation.json';
import knTranslations from './locales/kn/translation.json';

const resources = {
  en: { translation: enTranslations },
  ta: { translation: taTranslations },
  hi: { translation: hiTranslations },
  te: { translation: teTranslations },
  ml: { translation: mlTranslations },
  kn: { translation: knTranslations }
};

const savedLanguage = localStorage.getItem('i18nextLng') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng);
  document.documentElement.lang = lng;
  document.documentElement.dir = i18n.dir(lng);
});

export default i18n;
