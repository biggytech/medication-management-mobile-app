import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AuthInfo, AuthStrategy } from "@/services/auth/AuthStrategy";
import { DefaultAuthStrategy } from "@/services/auth/strategies/DefaultAuthStrategy";
import { AnonymousAuthStrategy } from "@/services/auth/strategies/AnonymousAuthStrategy";
import { LanguageService } from "@/services/language/LanguageService";
import { DefaultSignUpAndAuthStrategy } from "@/services/auth/strategies/DefaultSignUpAndAuthStrategy";
import { AnonymousFinishSignUpAuthStrategy } from "@/services/auth/strategies/AnonymousFinishSignUpAuthStrategy";

export enum AuthType {
  DEFAULT_SIGN_IN = "DEFAULT_SIGN_IN",
  DEFAULT_SIGN_UP = "DEFAULT_SIGN_UP",
  ANONYMOUS_SIGN_UP = "ANONYMOUS_SIGN_UP",
  ANONYMOUS_FINISH_SIGN_UP = "ANONYMOUS_FINISH_SIGN_UP",
}

export interface AuthData {
  fullName?: string;
  email: string;
  password: string;
}

export class AuthService {
  private static readonly AUTH_INFO_KEY = "@auth_info_key";

  private static instance: AuthService | null = null;

  private authStrategy: AuthStrategy = new DefaultAuthStrategy();
  private token: string | null = null;
  private fullName: string = LanguageService.translate("Guest");
  private isGuest: boolean = true;
  private isDoctor: boolean = false;
  private id: number = 0;

  private constructor() {}

  // Singleton
  private static getInstance() {
    if (AuthService.instance === null) {
      AuthService.instance = new AuthService();
    }

    return AuthService.instance;
  }

  public static get token(): string | null {
    return AuthService.getInstance().token;
  }

  public static get fullName(): string {
    return AuthService.getInstance().fullName;
  }

  public static get isGuest(): boolean {
    return AuthService.getInstance().isGuest;
  }

  private static getAuthStrategyByType(type: AuthType): AuthStrategy {
    switch (type) {
      case AuthType.DEFAULT_SIGN_IN:
        return new DefaultAuthStrategy();
      case AuthType.DEFAULT_SIGN_UP:
        return new DefaultSignUpAndAuthStrategy();
      case AuthType.ANONYMOUS_SIGN_UP:
        return new AnonymousAuthStrategy();
      case AuthType.ANONYMOUS_FINISH_SIGN_UP:
        return new AnonymousFinishSignUpAuthStrategy();
      default:
        return new DefaultAuthStrategy();
    }
  }

  public static async loadAuthInfo(): Promise<AuthInfo | null> {
    if (!AuthService.getInstance().token) {
      const authInfo = await AsyncStorage.getItem(AuthService.AUTH_INFO_KEY);

      if (authInfo) {
        try {
          const authInfoParsed: AuthInfo = JSON.parse(authInfo);
          AuthService.setAuthInfo(authInfoParsed);
          return authInfoParsed;
        } catch {}
      }
    }

    return null;
  }

  public static setAuthInfo(authInfo: AuthInfo) {
    const { token, fullName, isGuest, isDoctor, id } = authInfo;

    AuthService.getInstance().token = token;
    AuthService.getInstance().fullName = fullName;
    AuthService.getInstance().isGuest = isGuest;
    AuthService.getInstance().isDoctor = isDoctor;
    AuthService.getInstance().id = id;
  }

  private static resetAuthInfo() {
    AuthService.getInstance().token = null;
    AuthService.getInstance().fullName = LanguageService.translate("Guest");
    AuthService.getInstance().isGuest = true;
    AuthService.getInstance().isDoctor = false;
    AuthService.getInstance().id = 0;
  }

  private static async saveAuthInfo(authInfo: AuthInfo): Promise<void> {
    const authInfoStringified = JSON.stringify(authInfo);
    await AsyncStorage.setItem(AuthService.AUTH_INFO_KEY, authInfoStringified);
    AuthService.setAuthInfo(authInfo);
  }

  public static getIsAuthenticated() {
    return Boolean(AuthService.token);
  }

  public static async removeAuthInfo(): Promise<void> {
    await AsyncStorage.setItem(AuthService.AUTH_INFO_KEY, "");
    AuthService.resetAuthInfo();
  }

  public static setAuthStrategy(type: AuthType) {
    AuthService.getInstance().authStrategy =
      AuthService.getAuthStrategyByType(type);
  }

  public static async authenticate(data?: AuthData) {
    const authInfo =
      await AuthService.getInstance().authStrategy.authenticate(data);

    await AuthService.saveAuthInfo(authInfo);

    return authInfo;
  }
}
