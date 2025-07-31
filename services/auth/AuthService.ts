import AsyncStorage from "@react-native-async-storage/async-storage";
import type { IAuthStrategy } from "@/services/auth/IAuthStrategy";
import { DefaultAuthStrategy } from "@/services/auth/strategies/DefaultAuthStrategy";
import { OfflineAuthStrategy } from "@/services/auth/strategies/OfflineAuthStrategy";

export enum AuthType {
  DEFAULT = "DEFAULT",
  OFFLINE = "OFFLINE",
}

export interface AuthData {
  username?: string;
  password?: string;
}

export class AuthService {
  private static readonly TOKEN_KEY = "@token";

  private static instance: AuthService | null = null;

  private authStrategy: IAuthStrategy = new DefaultAuthStrategy();
  private token: string | null = null;

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

  public static get isOnlineUser() {
    return (
      AuthService.isLoggedIn &&
      !(AuthService.getInstance().authStrategy instanceof OfflineAuthStrategy)
    );
  }

  private static getAuthStrategyByType(type: AuthType): IAuthStrategy {
    switch (type) {
      case AuthType.DEFAULT:
        return new DefaultAuthStrategy();
      case AuthType.OFFLINE:
        return new OfflineAuthStrategy();
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

  public static async removeToken(): Promise<void> {
    await AsyncStorage.setItem(AuthService.TOKEN_KEY, "");
    AuthService.getInstance().token = null;
  }

  public static setAuthStrategy(type: AuthType) {
    AuthService.getInstance().authStrategy =
      AuthService.getAuthStrategyByType(type);
  }

  public static async authenticate(data?: AuthData) {
    const { userName, token } =
      await AuthService.getInstance().authStrategy.authenticate(data);

    await AuthService.getInstance().setToken(token);

    return {
      userName,
    };
  }
}
