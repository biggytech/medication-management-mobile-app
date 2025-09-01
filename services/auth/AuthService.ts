import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AuthStrategy } from "@/services/auth/AuthStrategy";
import { DefaultAuthStrategy } from "@/services/auth/strategies/DefaultAuthStrategy";
import { AnonymousAuthStrategy } from "@/services/auth/strategies/AnonymousAuthStrategy";
import { LanguageService } from "@/services/language/LanguageService";
import { DefaultSignUpAndAuthStrategy } from "@/services/auth/strategies/DefaultSignUpAndAuthStrategy";

export enum AuthType {
  DEFAULT = "DEFAULT",
  DEFAULT_SIGN_UP = "DEFAULT_SIGN_UP",
  ANONYMOUS = "ANONYMOUS",
}

export interface AuthData {
  fullName?: string;
  email: string;
  password: string;
}

export class AuthService {
  private static readonly TOKEN_KEY = "@token";

  private static instance: AuthService | null = null;

  private authStrategy: AuthStrategy = new DefaultAuthStrategy();
  private token: string | null = null;
  private fullName: string = LanguageService.translate("Guest");

  private constructor() {}

  private static getInstance() {
    if (AuthService.instance === null) {
      AuthService.instance = new AuthService();
    }

    return AuthService.instance;
  }

  public static get isLoggedIn() {
    return Boolean(AuthService.getInstance().token);
  }

  public static get isKnownUser() {
    return (
      AuthService.isLoggedIn &&
      !(AuthService.getInstance().authStrategy instanceof AnonymousAuthStrategy)
    );
  }

  private static getAuthStrategyByType(type: AuthType): AuthStrategy {
    switch (type) {
      case AuthType.DEFAULT:
        return new DefaultAuthStrategy();
      case AuthType.DEFAULT_SIGN_UP:
        return new DefaultSignUpAndAuthStrategy();
      case AuthType.ANONYMOUS:
        return new AnonymousAuthStrategy();
      default:
        return new DefaultAuthStrategy();
    }
  }

  public static async loadToken(): Promise<void> {
    if (!AuthService.getInstance().token) {
      AuthService.getInstance().token =
        (await AsyncStorage.getItem(AuthService.TOKEN_KEY)) || null;
    }
  }

  private async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(AuthService.TOKEN_KEY, token);
    this.token = token;
  }

  public static getToken(): string | null {
    return AuthService.getInstance().token;
  }

  private async setFullName(fullName: string): Promise<void> {
    this.fullName = fullName;
  }

  public static getUserName(): string {
    return AuthService.getInstance().fullName;
  }

  public static async removeToken(): Promise<void> {
    await AsyncStorage.setItem(AuthService.TOKEN_KEY, "");
    AuthService.getInstance().token = null;
  }

  public static setAuthStrategy(type: AuthType) {
    AuthService.getInstance().authStrategy =
      AuthService.getAuthStrategyByType(type);
  }

  public static async authenticate(data?: AuthData) {
    const { fullName, token } =
      await AuthService.getInstance().authStrategy.authenticate(data);

    await AuthService.getInstance().setToken(token);
    await AuthService.getInstance().setFullName(fullName);

    return {
      fullName,
    };
  }
}
