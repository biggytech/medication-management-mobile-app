import AsyncStorage from "@react-native-async-storage/async-storage";
import type { i18n as I18nType } from "i18next";
import i18n from "@/i18n";

export class LanguageService {
  private static readonly LANGUAGE_KEY = "@language";
  private static instance: LanguageService | null = null;
  private readonly i18n: I18nType;

  private constructor(i18n: I18nType) {
    this.i18n = i18n;
  }

  private static getInstance() {
    if (LanguageService.instance === null) {
      LanguageService.instance = new LanguageService(i18n);
    }

    return LanguageService.instance;
  }

  private static async getCurrentLanguage() {
    return await AsyncStorage.getItem(LanguageService.LANGUAGE_KEY);
  }

  public static async loadCurrentLanguage() {
    const language = await LanguageService.getCurrentLanguage();
    if (language) {
      const instance = LanguageService.getInstance();
      await instance.i18n.changeLanguage(language);
    }
    return language;
  }

  public static async changeLanguage(language: string) {
    const instance = LanguageService.getInstance();
    await AsyncStorage.setItem(LanguageService.LANGUAGE_KEY, language);
    await instance.i18n.changeLanguage(language);
  }

  public static translate(...args: Parameters<I18nType["t"]>) {
    const instance = LanguageService.getInstance();
    return instance.i18n.t(...args);
  }
}
