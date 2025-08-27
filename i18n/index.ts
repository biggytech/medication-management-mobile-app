import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import translationRu from "./locales/ru-RU/translation.json";
import translationEn from "./locales/en-US/translation.json";
import { AvailableLanguages, DEFAULT_LANGUAGE } from "@/constants/language";

const resources: {
  [K in AvailableLanguages]: { translation: Record<string, string> };
} = {
  [AvailableLanguages.RU]: { translation: translationRu },
  [AvailableLanguages.EN]: { translation: translationEn },
};

const initI18n = async () => {
  const savedLanguage = await AsyncStorage.getItem("language");

  i18n.use(initReactI18next).init({
    compatibilityJSON: "v4",
    resources,
    lng: savedLanguage ?? undefined,
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;
