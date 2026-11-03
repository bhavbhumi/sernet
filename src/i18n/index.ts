import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import hi from './locales/hi.json';
import mr from './locales/mr.json';
import gu from './locales/gu.json';
import ta from './locales/ta.json';
import pa from './locales/pa.json';
import te from './locales/te.json';
import kn from './locales/kn.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      mr: { translation: mr },
      gu: { translation: gu },
      ta: { translation: ta },
      pa: { translation: pa },
      te: { translation: te },
      kn: { translation: kn },
    },
    // Render English on the server and first client paint (no hydration mismatch);
    // applyDetectedLanguage() switches to the visitor's saved language after mount.
    lng: 'en',
    showSupportNotice: false,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export function applyDetectedLanguage() {
  if (typeof window === 'undefined') return;
  const detected = i18n.services.languageDetector?.detect();
  const lang = Array.isArray(detected) ? detected[0] : detected;
  const code = lang?.split('-')[0];
  if (code && code !== i18n.language && Object.keys(i18n.options.resources ?? {}).includes(code)) {
    void i18n.changeLanguage(code);
  }
}

export const languageOptions = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'pa', label: 'Punjabi', nativeLabel: 'ਪੰਜਾਬੀ' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ' },
];

export default i18n;
