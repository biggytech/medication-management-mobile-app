import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import translationRu from "./locales/ru-RU/translation.json";
import translationEn from "./locales/en-US/translation.json";

console.log('translationRu', translationRu)

const resources = {
    "ru-RU": { translation: translationRu },
    "en-US": { translation: translationEn },
};

const initI18n = async () => {
    let savedLanguage = await AsyncStorage.getItem("language");

    if (!savedLanguage) {
        savedLanguage = Localization.locale;
    }

    i18n.use(initReactI18next).init({
        compatibilityJSON: "v4",
        resources,
        lng: savedLanguage,
        fallbackLng: "en-US",
        interpolation: {
            escapeValue: false,
        },
    });
};

initI18n();

export default i18n;
