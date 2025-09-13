import type { AuthData } from "./AuthService";

export interface AuthInfo {
  token: string;
  fullName: string;
  isGuest: boolean;
}

export interface AuthStrategy {
  authenticate(data?: AuthData): Promise<AuthInfo>;
}
