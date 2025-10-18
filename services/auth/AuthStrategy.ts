import type { AuthData } from "./AuthService";

export interface AuthInfo {
  token: string | null;
  fullName: string;
  isGuest: boolean;
  isDoctor: boolean;
  id: number;
}

export interface AuthStrategy {
  authenticate(data?: AuthData): Promise<AuthInfo>;
}
