import type { AuthStrategy } from "@/services/auth/AuthStrategy";
import { APIService } from "@/services/APIService";

export class AnonymousAuthStrategy implements AuthStrategy {
  public async authenticate() {
    const { token, full_name } = await APIService.signUpOffline();
    return {
      fullName: full_name,
      token,
    };
  }
}
