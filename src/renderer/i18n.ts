import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(HttpApi)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'he', // Set default language here
        debug: true,
        interpolation: {
            escapeValue: false, // React already does escaping
        },
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json', // Path to the language files
        },
    });

export default i18n;