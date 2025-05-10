import AsyncStorage from "@react-native-async-storage/async-storage";
import type { IAuthStrategy } from "@/services/auth/IAuthStrategy";
import { DefaultAuthStrategy } from "@/services/auth/strategies/DefaultAuthStrategy";

export enum AuthType {
  DEFAULT = "DEFAULT",
}

export class AuthService {
  private static readonly TOKEN_KEY = "@token";

  private _authStrategy!: IAuthStrategy;
  private _token: string | null = null;

  constructor(type: AuthType = AuthType.DEFAULT) {
    this.setAuthStrategy(type);
  }

  private static getAuthStrategyByType(type: AuthType): IAuthStrategy {
    switch (type) {
      case AuthType.DEFAULT:
        return DefaultAuthStrategy;
      default:
        return DefaultAuthStrategy;
    }
  }

  public async init(): Promise<void> {
    this._token = (await AsyncStorage.getItem(AuthService.TOKEN_KEY)) || null;
  }

  public async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(AuthService.TOKEN_KEY, token);
    this._token = token;
  }

  public getToken(): string | null {
    return this._token;
  }

  public async removeToken(): Promise<void> {
    await AsyncStorage.setItem(AuthService.TOKEN_KEY, "");
    this._token = null;
  }

  public setAuthStrategy(type: AuthType) {
    this._authStrategy = AuthService.getAuthStrategyByType(type);
  }

  public async authenticate(): Promise<{
    name: string;
  }> {
    // TODO: authentication

    const token = "random-token";
    await this.setToken(token);

    return {
      name: "Undefined User",
    };
  }
}
