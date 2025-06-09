import type { AuthData } from "./AuthService";

export interface IAuthStrategy {
  authenticate(data?: AuthData): Promise<{
    userName: string;
    token: string;
  }>;
}
