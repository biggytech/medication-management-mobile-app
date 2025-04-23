import AsyncStorage from "@react-native-async-storage/async-storage";
import { i18n as I18nType } from "i18next";
import i18n from '@/i18n'

export class LanguageService {
    private static readonly LANGUAGE_KEY = '@language';
    private static instance: LanguageService | null = null;
    private readonly i18n: I18nType;

    private constructor(i18n: I18nType) {
        this.i18n = i18n;
    }

    public static getInstance() {
        if (LanguageService.instance === null) {
            LanguageService.instance = new LanguageService(i18n);
        }

        return LanguageService.instance;
    }

    private async getCurrentLanguage() {
        return await AsyncStorage.getItem(LanguageService.LANGUAGE_KEY);
    }

    public async loadCurrentLanguage() {
        const laguage = await this.getCurrentLanguage();
        if (laguage) {
            await this.i18n.changeLanguage(laguage);
        }
        return laguage;
    }

    public async changeLanguage(language: string) {
        await AsyncStorage.setItem(LanguageService.LANGUAGE_KEY, language);
        await i18n.changeLanguage(language);
    }
    
    public translate(...args: Parameters<I18nType['t']>) {
        return this.i18n.t(...args);
    }
}
