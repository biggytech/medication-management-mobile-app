import type { AuthData } from "./AuthService";

export interface AuthStrategy {
  authenticate(data?: AuthData): Promise<{
    fullName: string;
    token: string;
  }>;
}
