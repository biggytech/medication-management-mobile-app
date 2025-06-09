import type { IAuthStrategy } from "@/services/auth/IAuthStrategy";
import { LanguageService } from "../../language/LanguageService";

const TOKEN_F0R_OFFLINE_USER = "TOKEN_F0R_OFFLINE_USER";

export class OfflineAuthStrategy implements IAuthStrategy {
  public async authenticate() {
    const token = TOKEN_F0R_OFFLINE_USER;

    return {
      userName: LanguageService.translate("Guest"),
      token,
    };
  }
}
