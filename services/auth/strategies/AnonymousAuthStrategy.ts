import type { IAuthStrategy } from "@/services/auth/IAuthStrategy";
import { APIService } from "@/services/APIService";

export class AnonymousAuthStrategy implements IAuthStrategy {
  public async authenticate() {
    const { token, full_name } = await APIService.signUpOffline();
    return {
      userName: full_name,
      token,
    };
  }
}
