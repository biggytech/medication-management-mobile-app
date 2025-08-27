import { AvailableLanguages } from "@/constants/language";

export const isAvailableLanguage = (
  language: string,
): language is AvailableLanguages => {
  return Object.values(AvailableLanguages).includes(
    language as AvailableLanguages,
  );
};
