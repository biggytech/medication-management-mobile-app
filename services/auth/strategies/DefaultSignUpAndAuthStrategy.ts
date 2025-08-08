import type { IAuthStrategy } from "@/services/auth/IAuthStrategy";
import type { AuthData } from "../AuthService";
import { APIService } from "../../APIService";
import { LanguageService } from "../../language/LanguageService";

export class DefaultSignUpAndAuthStrategy implements IAuthStrategy {
  public async authenticate(data?: AuthData) {
    const { token, full_name } = await APIService.signUpDefault({
      full_name: "Testik",
      is_guest: false,
    });
    return {
      userName: full_name,
      token,
    };
    // if (!data?.username || !data?.password) {
    //   throw new Error(LanguageService.translate("Missing required fields"));
    // }
    //
    // const { token, userName } = await APIService.login({
    //   username: data?.username,
    //   password: data?.password,
    // });
    //
    // return {
    //   userName,
    //   token,
    // };
  }
}
