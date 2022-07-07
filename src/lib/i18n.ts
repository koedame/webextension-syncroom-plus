import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import i18nJson from './i18n.json';
import browser from 'webextension-polyfill';

// type lang = 'en' | 'ja' | 'ko';

i18n.use(initReactI18next).init({
  resources: {
    ja: {
      translation: i18nJson.ja,
    },
    en: {
      translation: i18nJson.en,
    },
    ko: {
      translation: i18nJson.ko,
    },
  },
  lng: 'ja',
  fallbackLng: 'ja',
  interpolation: { escapeValue: false },
});

browser.storage.local.get('v2ConfigLanguage').then(({ v2ConfigLanguage }) => {
  if (typeof v2ConfigLanguage === 'undefined') {
    i18n.changeLanguage('ja');
  } else {
    i18n.changeLanguage(v2ConfigLanguage);
  }
});

const changeLanguage = (lang: string) => {
  i18n.changeLanguage(lang);
  browser.storage.local.set({ v2ConfigLanguage: lang });
};

const langMap = (lang: string) => {
  if (lang === 'en') return 'English';
  if (lang === 'ja') return '日本語';
  if (lang === 'ko') return '한국어';
  else return '日本語';
};

export { i18n, useTranslation, langMap, changeLanguage };
