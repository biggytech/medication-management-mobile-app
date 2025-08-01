import type { IAuthStrategy } from "@/services/auth/IAuthStrategy";
import { APIService } from "@/services/APIService";

export class AnonymousAuthStrategy implements IAuthStrategy {
  public async authenticate() {
    const { token, userName } = await APIService.signUpOffline();
    return {
      userName,
      token,
    };
  }
}
