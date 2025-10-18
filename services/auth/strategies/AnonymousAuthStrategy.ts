import type { AuthStrategy } from "@/services/auth/AuthStrategy";
import { APIService } from "@/services/APIService";

export class AnonymousAuthStrategy implements AuthStrategy {
  public async authenticate() {
    const { token, full_name, id, is_doctor } =
      await APIService.signUp.anonymous();
    return {
      fullName: full_name,
      token,
      isGuest: true,
      isDoctor: is_doctor,
      id,
    };
  }
}
