import type { AuthStrategy } from "@/services/auth/AuthStrategy";
import { APIService } from "@/services/APIService";
import type { AuthData } from "@/services/auth/AuthService";
import { LanguageService } from "@/services/language/LanguageService";

export class AnonymousFinishSignUpAuthStrategy implements AuthStrategy {
  public async authenticate(data?: AuthData) {
    if (!data?.fullName || !data?.email || !data?.password) {
      throw new Error(LanguageService.translate("Missing required fields"));
    }

    const { token, full_name, id, is_doctor } =
      await APIService.signUp.anonymousFinish({
        full_name: data.fullName,
        email: data.email,
        password: data.password,
      });

    return {
      fullName: full_name,
      token,
      isGuest: false,
      isDoctor: is_doctor,
      id,
    };
  }
}
