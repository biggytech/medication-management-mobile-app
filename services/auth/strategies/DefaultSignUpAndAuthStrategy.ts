import type { AuthStrategy } from "@/services/auth/AuthStrategy";
import type { AuthData } from "@/services/auth/AuthService";
import { APIService } from "@/services/APIService";
import { LanguageService } from "@/services/language/LanguageService";

export class DefaultSignUpAndAuthStrategy implements AuthStrategy {
  public async authenticate(data?: AuthData) {
    if (!data?.fullName || !data?.email || !data?.password) {
      throw new Error(LanguageService.translate("Missing required fields"));
    }

    const { token, full_name, id } = await APIService.signUp.default({
      full_name: data.fullName,
      email: data.email,
      password: data.password,
    });

    return {
      fullName: full_name,
      token,
      isGuest: false,
      id,
    };
  }
}
