import type { IAuthStrategy } from "@/services/auth/IAuthStrategy";
import { LanguageService } from "../../language/LanguageService";
import { APIService } from "@/services/APIService";

const TOKEN_F0R_OFFLINE_USER = "TOKEN_F0R_OFFLINE_USER";

export class OfflineAuthStrategy implements IAuthStrategy {
  public async authenticate() {
    // const token = TOKEN_F0R_OFFLINE_USER;

    const { token } = await APIService.signUpOffline();

    // return {
    //   userName,
    //   token,
    // };

    return {
      userName: LanguageService.translate("Guest"),
      token,
    };
  }
}
